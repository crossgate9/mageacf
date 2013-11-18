<?php

class EcomInfinity_Mageacf_Adminhtml_MageacfController extends Mage_Adminhtml_Controller_Action {
    public function indexAction() {
        $this->loadLayout();     
        $this->renderLayout();
    }
}