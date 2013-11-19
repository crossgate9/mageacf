<?php

class EcomInfinity_Mageacf_Helper_Data extends Mage_Core_Helper_Abstract {
    public function getACFJson() {
        $_acfs = Mage::getModel('mageacf/group')->getCollection()->getItems();
        $_res = array();
        foreach ($_acfs as $_acf) {
            $_id = $_acf->getData('entity_id');
            $_res[$_id] = $_acf->getData();
        }
        return json_encode($_res);
    }
}