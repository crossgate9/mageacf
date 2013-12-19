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

    public function getColorAttributeId() {
        $_config = Mage::getModel('eav/config');
        $_attribute = $_config->getAttribute(Mage_Catalog_Model_Product::ENTITY, 'color');
        return $_attribute->getId();
    }

    public function isShowAdminLabel() {
        return Mage::getStoreConfig('mageacf/general/admin_label');
    }

    public function getCurrentLayerState() {
        $_layer = Mage::getSingleton('catalog/layer');
        $_filters = $_layer->getFilterableAttributes();
        $_colors = array();
        foreach ($_filters as $_attribute) {
            if ($_attribute->getAttributeCode() === 'color') {
                $_block = Mage::app()->getLayout()->createBlock('catalog/layer_filter_attribute')->setLayer($_layer)->setAttributeModel($_attribute)->init();
                foreach ($_block->getItems() as $_item) {
                    $_colors[] = $_item->getValue();
                }
                break;
            }
        }
        return json_encode($_colors);
    }

    public function isAvailableColorOnly() {
        return Mage::getStoreConfig('mageacf/general/available_color_only');
    }
}