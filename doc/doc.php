<?php

new doc('src'); // Must run this script from the parent directory...meh.

class doc {

  private $data;

  function __construct($file_root) {

    $this->data = array();

    foreach (scandir($file_root) as $file_name) {

      if (in_array($file_name, array('.', '..', 'externs.js'))) {
        continue;
      }

      $handle = fopen($file_root . '/' . $file_name, 'r');

      while ($line = fgets($handle)) {
        $line = trim($line, "\r\n");
        $line = preg_replace('/^ \* ?(?!\/)/', '', $line); // JEZ added to support * on each comment line
        if ($line === '/**') {
          if (isset($previous_name)) {
            $this->data[$previous_name]['source'] = trim(implode("\n", $lines));
          }
          $lines = array();
        // } else if ($line === '*/') {
        } else if (substr($line, 0, 3) === ' */') { // JEZ added space at beginning to support nicer formatted comments
          $first_line = trim(fgets($handle), "\r\n");
          if (substr($first_line, -1) === '=') {
            $first_line .= trim(fgets($handle), "\r\n");
          }
          if ($first_line) {
            $previous_name = $this->parse($first_line, implode("\n", $lines), $file_name);
            $lines = array($first_line);
          }
        } else {
          $lines[] = preg_replace('/^\*/','',$line);
        }
      }

    }

    $this->data[$previous_name]['source'] = trim(implode("\n", $lines));

    foreach ($this->data as $parent_name => $doc) {
      $this->data[$parent_name]['children'] = array();
      foreach ($this->data as $name => $doc) {
        if ($doc['parent'] === $parent_name) {
          $this->data[$parent_name]['children'][] = $name;
        }
      }
    }

    var_dump(file_put_contents('doc/docs.js', 'var docs = ' . json_encode($this->data)));

  }

  private function parse($first_line, $lines, $file_name) {

    $tags = $this->parse_tags($lines);

    if (isset($tags['constructor'])) {
      $type = 'constructor';
    } else if (isset($tags['interface'])) {
      $type = 'interface';
    } else if(isset($tags['namespace'])) {
      $type = 'namespace';
    } else if(strpos($first_line, '.prototype.') !== false) {
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

    $name = $this->parse_name($first_line);

    $parent = $this->parse_parent($name);

    $title = explode('.', $name);
    $title = end($title);

    $description = $this->parse_description($lines);

    $summary = $this->parse_summary($tags, $description);

    $lambda = (strpos($first_line, 'function(') !== false);

    $parameters = array();
    if (isset($tags['param'])) {
      for ($i = 0; isset($tags['param'][$i]); ++$i) {
        $parameters[] = $tags['param'][$i]['name'];
      }
    }

    $this->data[$name] = array(
      'file_name' => $file_name,
      'name' => $name,
      'title' => $title,
      'description' => $description,
      'summary' => $summary,
      'parent' => $parent,
      'type' => $type,
      'visibility' => $visibility,
      'lambda' => $lambda,
      'parameters' => $parameters,
      'tags' => $tags,
    );

    return $name;

  }

  private function parse_name($name){
    $name = preg_split('/[\s;]/', $name);
    if ($name[0] === 'var') {
      return $name[1];
    } else {
      return $name[0];
    }
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

  private function parse_tags($lines) {

    $lines = preg_split('/^@/m', $lines);

    unset($lines[0]);

    $tags = array();

    foreach ($lines as $tag) {
      preg_match('/^(\w+)\s*(.*)/s',trim($tag),$match);
      $tags[$match[1]][] = $match[2];
    }

    foreach ($tags as $name => $tag) {
      if (method_exists($this, 'parse_tag_'.$name)) {
        foreach($tag as $i => $value) {
          $tags[$name][$i] = $this->{'parse_tag_'.$name}($value);
        }
      }
    }

    return $tags;

  }

  private function parse_tag_param($tag){
    preg_match('/^\{(.+?)\}\s+(\w+)\s*(.*?)$/s', $tag, $match);
    return array(
      'type' => $match[1],
      'name' => $match[2],
      'description' => $match[3],
    );
  }
  private function parse_tag_return($tag){
    if(!preg_match('/^\{(.+?)\}\s+(.*?)$/s', $tag, $match)){
      preg_match('/^\{(.+?)\}\s*(.*?)$/s', $tag, $match);
    }
    return array(
      'type' => $match[1],
      'description' => $match[2],
    );
  }
  private function parse_tag_test($tag){
    preg_match('/^\{(.+?)\}\s+(.+?\.(?=\W))\s*(.+)/s', $tag, $match);
    return array(
      'result' => $match[1],
      'description' => $match[2],
      'code' => $match[3],
    );
  }
  private function parse_tag_link($tag){
    preg_match('/\:\/\/(.+?)\//', $tag, $match);
    return array(
      'name' => $match[1],
      'href' => $tag,
    );
  }
  private function parse_tag_type($tag){
    preg_match('/^\{(.+?)\}/', $tag, $match);
    return array(
      'type' => $match[1],
    );
  }
  private function parse_tag_implements($tag){
    return $this->parse_tag_type($tag);
  }
  private function parse_tag_extends($tag){
    return $this->parse_tag_type($tag);
  }
  private function parse_tag_see($tag){
    return $this->parse_tag_type($tag);
  }

}
