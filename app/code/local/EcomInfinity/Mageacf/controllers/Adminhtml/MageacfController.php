<?php

class EcomInfinity_Mageacf_Adminhtml_MageacfController extends Mage_Adminhtml_Controller_Action {
    public function indexAction() {
        $this->loadLayout();     
        $this->renderLayout();
    }



    public function createAction() {
        $_params = $this->getRequest()->getParams();
        $_acf = Mage::getModel('mageacf/group');
        $_acf->setData('name', $_params['name']);
        $_acf->setData('color', $_params['color']);
        $_acf->setData('store_view', $_params['storeview']);
        $_acf->setData('attributes', json_encode($_params['list']));
        $_acf->setData('position', 0);
        $_acf->setData('created_time', date('Y-m-d H:i:s', time()));
        $_acf->setData('update_time', date('Y-m-d H:i:s', time()));
        $_id = $_acf->save();

        $this->getResponse()->setBody(
            json_encode(
                Mage::getModel('mageacf/group')->load($_id)->getData()
            )
        );
    }
}