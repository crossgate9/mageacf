<?php

class EcomInfinity_Mageacf_Block_Adminhtml_Edit extends Mage_Core_Block_Template {
    public function _prepareLayout() {
        return parent::_prepareLayout();
    }

    public function getACFBaseUrl() {
        return $this->getUrl('adminhtml/mageacf');
    }

    public function getAllColors() {
        $_config = Mage::getModel('eav/config');
        $_attribute = $_config->getAttribute(Mage_Catalog_Model_Product::ENTITY, 'color');

        $_values = $_attribute->setStoreId(1)->getSource()->getAllOptions();

        foreach ($_values as $_key => $_color) {
            if (strpos($_color['label'], ';') !== false) {
                $_c = explode(';', $_color['label']);
                $_values[$_key]['code'] = $_c[0];
                $_values[$_key]['label'] = $_c[1];
            } else {
                $_values[$_key]['code'] = '#fff';
            }
        }

        return $_values;
    }

    public function getAllStores() {
        $_stores = Mage::getSingleton('adminhtml/system_store')->getStoreValuesForForm(false, true);

        return $_stores;
    }

    public function getAllACFs() {
        $_acfs = Mage::getModel('mageacf/group')->getCollection();
        $_result = array();
        foreach ($_acfs as $_acf) {
            $_result[] = $_acf->getData();
        }
        return $_result;
    }
}