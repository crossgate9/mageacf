<?php

class EcomInfinity_Mageacf_Model_Mysql4_Group extends Mage_Core_Model_Mysql4_Abstract
{
    public function _construct()
    {    
        // Note that the mageacf_id refers to the key field in your database table.
        $this->_init('mageacf/ei_colorgroup', 'entity_id');
    }
}