<?php

class EcomInfinity_Mageacf_Adminhtml_MageacfController extends Mage_Adminhtml_Controller_Action {

    private function _prepareResponse($_isSuccess, $_data) {
        return json_encode(array(
            'success' => $_isSuccess,
            'data' => $_data
        ));
    }

    public function indexAction() {
        $this->loadLayout();     
        $this->renderLayout();
    }

    public function createAction() {
        try {
            $_params = $this->getRequest()->getParams();
            $_acf = Mage::getModel('mageacf/group');
            $_acf->setData('name', (string) $_params['name']);
            $_acf->setData('color', (string) $_params['color']);
            $_acf->setData('store_view', (string) $_params['storeview']);
            $_acf->setData('position', (string) '0');
            $_acf->setData('attributes', (string) json_encode($_params['list']));
            $_acf->setData('created_time', (string) date('Y-m-d H:i:s', time()));
            $_acf->setData('update_time', (string) date('Y-m-d H:i:s', time()));
            $_acf->save();
            $_id = $_acf->getId();

            $this->getResponse()->setBody(
                $this->_prepareResponse(
                    true, 
                    Mage::getModel('mageacf/group')->load($_id)->getData()
                )
            );
        } catch (Exception $e) {
            $this->getResponse()->setBody(
                $this->_prepareResponse(
                    false, 
                    $e->getTrace()
                )
            );
        }
    }

    public function deleteAction() {
        try {
            $_params = $this->getRequest()->getParams();
            $_id = $_params['id'];
            $_acf = Mage::getModel('mageacf/group')->load($_id);
            $_acf->delete();
            $this->getResponse()->setBody(
                $this->_prepareResponse(
                    true, 
                    array('id'=>$_id)
                )
            );   
        } catch (Exception $e) {
            $this->getResponse()->setBody(
                $this->_prepareResponse(
                    false, 
                    $e->getMessage()
                )
            );   
        }
    }
}