var ACF = (function($) {
    var c = function($ctn, data, storeview) {
        this.$ctn = $ctn;
        this.gData = _.sortBy(data, function(obj) { return -obj.position; });
        this.storeview = storeview;

        var isEmpty = true;
        $.each(this.gData, function(idx, val) {
            if (val.store_view === storeview) {
                isEmpty = false;
            }
        });
        if (isEmpty === true) {
            this.storeview = '0';
        }
        this.render();
    };

    var _previewColorTemplate = '<span class="color-box" data-id="%s"><span style="background: %s"></span></span>',
        _clearTemplate = '<div class="clear"></div>';

    c.prototype.render = function() {
        var self = this;
        self.$ctn.empty();
        $.each(self.gData, function(idx, val) {
            if (val.store_view === self.storeview) {
                self.$ctn.append(sprintf(_previewColorTemplate, val.entity_id, val.color));
            }
        });
        self.$ctn.append(_clearTemplate);
    };

    return c;
})(jQuery);
var acf;

(function($) {
    $(function() {
        acf = new ACF($('.acf-container .filters'), acfJson, storeview);
    });
})(jQuery);