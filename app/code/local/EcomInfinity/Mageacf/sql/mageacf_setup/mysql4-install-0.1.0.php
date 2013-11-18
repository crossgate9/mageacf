<?php

$installer = $this;

$installer->startSetup();

$installer->run("

-- DROP TABLE IF EXISTS {$this->getTable('ei_colorgroup')};
CREATE TABLE {$this->getTable('ei_colorgroup')} (
  `entity_id` int(11) unsigned NOT NULL auto_increment,
  `name` varchar(255) NOT NULL default '',
  `color` varchar(255) NOT NULL default '',
  `store_view` int NOT NULL default '0',
  `created_time` datetime NULL,
  `update_time` datetime NULL,
  PRIMARY KEY (`entity_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- DROP TABLE IF EXISTS {$this->getTable('ei_colorattr')};
CREATE TABLE {$this->getTable('ei_colorattr')} (
  `entity_id` int(11) unsigned NOT NULL auto_increment,
  `group_id` int(11) NOT NULL,
  `attribute_value` int(11) NOT NULL,
  `position` int(11) NOT NULL,
  `created_time` datetime NULL,
  `update_time` datetime NULL,
  PRIMARY KEY (`entity_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

    ");

$installer->endSetup(); 