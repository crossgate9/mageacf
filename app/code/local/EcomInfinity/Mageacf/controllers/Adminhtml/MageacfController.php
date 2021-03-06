<?php

class EcomInfinity_Mageacf_Adminhtml_MageacfController extends Mage_Adminhtml_Controller_Action {

    private function _prepareResponse($_isSuccess, $_data, $_message = "") {
        return json_encode(array(
            'success' => $_isSuccess,
            'data' => $_data,
            'message' => $_message,
        ));
    }

    public function indexAction() {
        $this->_title($this->__('Ecom Infinity'))
             ->_title($this->__('Color Group Management'));
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
                    Mage::getModel('mageacf/group')->load($_id)->getData(),
                    $this->__('The color group has been created.')
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
                    array('id'=>$_id),
                    $this->__('The color group has been deleted.')
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

    public function updateAction() {
        try {
            $_params = $this->getRequest()->getParams();
            $_id = $_params['id'];
            $_acf = Mage::getModel('mageacf/group')->load($_id);
            $_acf->setData('name', $_params['name']);
            $_acf->setData('color', $_params['color']);
            $_acf->setData('attributes', (string) json_encode($_params['list']));
            $_acf->setData('update_time', (string) date('Y-m-d H:i:s', time()));
            $_acf->save();
            $this->getResponse()->setBody(
                $this->_prepareResponse(
                    true, 
                    Mage::getModel('mageacf/group')->load($_id)->getData(),
                    $this->__('The color group has been updated.')
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

    public function positionAction() {
        try {
            $_params = $this->getRequest()->getParams();
            $_list = $_params['list'];
            $_len = count($_list);
            $_res = array();
            foreach($_list as $_id) {
                $_acf = Mage::getModel('mageacf/group')->load($_id);
                $_acf->setData('position', $_len);
                $_acf->save();
                $_res[$_id] = $_len;
                $_len --;
            }
            $this->getResponse()->setBody(
                $this->_prepareResponse(
                    true,
                    $_res,
                    $this->__('The order has been adjuested.')
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

    public function infoAction() {
        $_json = Mage::helper('mageacf')->getACFJson();
        $this->getResponse()->setBody(
            $this->_prepareResponse(
                true, 
                $_json,
                $this->__('Refresh complete.')
            )
        );
    }

    public function copyAction() {
        try {
            $_params = $this->getRequest()->getParams();
            $_storeview = $_params['store_view'];
            $_acfs = Mage::getModel('mageacf/group')->getCollection()->getItems();
            foreach ($_acfs as $_acf) {
                if ($_acf->getData('store_view') === '0') {
                    $_new_acf = Mage::getModel('mageacf/group');
                    $_new_acf->setData('name', $_acf->getData('name'));
                    $_new_acf->setData('color', $_acf->getData('color'));
                    $_new_acf->setData('store_view', (string) $_storeview);
                    $_new_acf->setData('position', $_acf->getData('position'));
                    $_new_acf->setData('attributes', $_acf->getData('attributes'));
                    $_new_acf->setData('created_time', (string) date('Y-m-d H:i:s', time()));
                    $_new_acf->setData('update_time', (string) date('Y-m-d H:i:s', time()));
                    $_new_acf->save();
                }
            }
            $this->getResponse()->setBody(
                $this->_prepareResponse(
                    true,
                    null,
                    $this->__('Copy complete.')
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