<?php

new hermes('src','doc');

class hermes {

	private $data;

	function __construct($file_root, $documentation_root) {

		$this->data = array();

		foreach (scandir($file_root) as $file_name) {

			if (in_array($file_name, array('.', '..', 'externs.js'))) {
				continue;
			}

			$handle = fopen($file_root . '/' . $file_name, 'r');

			$lines = null;
			while ($line = fgets($handle)) {
				$line = trim($line, "\r\n");
        $line = preg_replace('/^ \* ?(?!\/)/', '', $line); // JEZ added to support * on each comment line
				if (substr($line, 0, 3) === '/**') {
					$lines = array();
				// } else if (substr($line, 0, 2) === '*/') {
        } else if (substr($line, 0, 3) === ' */') { // JEZ added space at beginning to support nicer formatted comments

					$line = trim(fgets($handle), "\r\n");
					if(substr($line, -1, 1) === '='){
						$line .= ' ' . trim(fgets($handle), "\r\n ");
					}
					if ($line) {
						$this->parse(implode("\n", $lines), $line);
					}
					$lines = null;
				} else if ($lines !== null) {
					$lines[] = preg_replace('/^\*/','',$line);
				}
			}

		}

		foreach ($this->data as $parent_name => $doc) {
			$this->data[$parent_name]['children'] = array();
			foreach ($this->data as $name => $doc) {
				if ($doc['parent'] === $parent_name) {
					$this->data[$parent_name]['children'][] = $name;
				}
			}
		}

		file_put_contents($documentation_root . '/docs.js', 'var docs = ' . json_encode($this->data));

	}

	private function parse($lines, $line) {

		$tags = $this->parse_tags($lines);

		if (isset($tags['constructor'])) {
			$type = 'constructor';
		} else if (isset($tags['interface'])) {
			$type = 'interface';
		} else if(isset($tags['namespace'])) {
			$type = 'namespace';
		} else if(strpos($line, '.prototype.') !== false) {
			$type = 'prototype';
		} else {
			$type = 'static';
		}

		if (isset($tags['private'])) {
			$visibility = 'private';
		} else if (isset($tags['protected'])) {
			$visibility = 'protected';
		} else {
			$visibility = 'public';
		}

		$name = $this->parse_name($line);

		$title = explode('.', $name);
		$title = end($title);

		$description = $this->parse_description($lines);

		$parameters = array();
		if (isset($tags['param'])) {
			for ($i = 0; isset($tags['param'][$i]); ++$i) {
				$parameters[] = $tags['param'][$i]['name'];
			}
		}

		$this->data[$name] = array(
			'name' => $name,
			'title' => $title,
			'description' => $description,
			'summary' => $this->parse_summary($tags, $description),
			'parent' => $this->parse_parent($name),
			'type' => $type,
			'visibility' => $visibility,
			'lambda' => (strpos($line, 'function(') !== false),
			'parameters' => $parameters,
			'tags' => $tags,
		);

	}

	private function parse_name($name){
		$name = preg_split('/[\s;]/', $name);
		if ($name[0] === 'var') {
			return $name[1];
		} else {
			return $name[0];
		}
	}
	private function parse_tags($lines) {

		$lines = preg_split('/^@/m', $lines);

		unset($lines[0]);

		$tags = array();

		foreach (array_map('trim', $lines) as $tag) {
			preg_match('/^(\w+)\s*(.*)/s',$tag,$match);
			$tags[$match[1]][] = $match[2];
		}

		foreach ($tags as $name => $tag) {
			if (method_exists($this, 'parse_tag_'.$name)) {
				$tags[$name] = $this->{'parse_tag_'.$name}($tag);
			}
		}

		return $tags;

	}
	private function parse_parent($name){
		$parent = explode('.', $name);
		array_pop($parent);
		if (end($parent) === 'prototype') {
			array_pop($parent);
		}
		return implode('.', $parent);
	}
	private function parse_description($lines){
		if (preg_match('/(.+?)^@/ms', $lines, $match)) {
			return trim($match[1]);
		} else {
			return '';
		}
	}
	private function parse_summary($tags, $description) {
		if (isset($tags['summary'])) {
			return $tags['summary'][0];
		} else {
			if (preg_match('/(.+?\.)(\s|$)/s', $description, $match)) {
				return trim($match[1]);
			} else {
				return '';
			}
		}
	}

	private function parse_tag_param($tags){
		$results = array();
		foreach ($tags as $tag) {
			preg_match('/^\{(.+?)\}\s+(\w+)\s*(.*?)$/s', $tag, $match);
			$results[] = array(
				'type' => $match[1],
				'name' => $match[2],
				'description' => $match[3],
			);
		}
		return $results;
	}
	private function parse_tag_return($tags){
		$results = array();
		foreach ($tags as $tag) {
			preg_match('/^\{(.+?)\}\s*(.*?)$/s', $tag, $match);
			$results[] = array(
				'type' => $match[1],
				'description' => $match[2],
			);
		}
		return $results;
	}
	private function parse_tag_implements($tags){
		$results = array();
		foreach ($tags as $tag) {
			preg_match('/^\{(.+?)\}/', $tag, $match);
			$results[] = array(
				'type' => $match[1],
			);
		}
		return $results;
	}
	private function parse_tag_extends($tags){
		$results = array();
		foreach ($tags as $tag) {
			preg_match('/^\{(.+?)\}/', $tag, $match);
			$results[] = array(
				'type' => $match[1],
			);
		}
		return $results;
	}
	private function parse_tag_see($tags){
    print_r($tags);
		$results = array();
		foreach ($tags as $tag) {
			preg_match('/^\{(.+?)\}/', $tag, $match);
			$results[] = array(
				'type' => $match[1],
			);
		}
		return $results;
	}
	private function parse_tag_link($tags){
		$results = array();
		foreach ($tags as $tag) {
			preg_match('/\:\/\/(.+?)\//', $tag, $match);
			$results[] = array(
				'name' => $match[1],
				'href' => $tag,
			);
		}
		return $results;
	}

}

