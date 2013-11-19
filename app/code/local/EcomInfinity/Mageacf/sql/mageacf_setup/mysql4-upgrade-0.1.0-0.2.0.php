<?php

$installer = $this;

$installer->startSetup();
$installer->run("
    
ALTER TABLE {$this->getTable('ei_colorgroup')} ADD  `position` INT NOT NULL AFTER `store_view`;
ALTER TABLE {$this->getTable('ei_colorgroup')} ADD  `attributes` TEXT NOT NULL AFTER  `position`;

DROP TABLE IF EXISTS {$this->getTable('ei_colorattr')};

");

$installer->endSetup();