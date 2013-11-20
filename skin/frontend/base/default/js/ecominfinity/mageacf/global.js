var ACF = (function($) {
    var c = function($ctn, data, storeview) {
        this.$ctn = $ctn;
        this.gData = data;
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

        $ctn.parent().find('.btn-clear').on('click', function() {
            var currentUri = new Uri(document.URL);
            currentUri.deleteQueryParam('color[]');
            window.location = currentUri.toString();
            return false;
        });

        this.render();
    };

    var _previewColorTemplate = '<span class="color-box" data-id="%s" data-selected="%s"><span style="background: %s"></span></span>',
        _clearTemplate = '<div class="clear"></div>';

    var parseUrl = function() {
        var uri = new Uri(document.URL);
        return uri.getQueryParamValues('color[]');
    };

    var isSubset = function(a, b) {
        if (a.length === 0) return false;
        var c = _.intersection(a, b);
        return (c.length === a.length);
    };

    c.prototype.render = function() {
        var self = this;
        var currentColors = parseUrl();
        var data = _.sortBy(self.gData, function(obj) { return -obj.position; });

        self.$ctn.empty();
        $.each(data, function(idx, val) {
            if (val.store_view === self.storeview) {
                var selected = isSubset($.parseJSON(val.attributes), currentColors);
                self.$ctn.append(sprintf(_previewColorTemplate, val.entity_id, selected, val.color));
            }
        });
        self.$ctn.append(_clearTemplate);
        
        self.$ctn.find('.color-box').on('click', function() {
            var selected = $(this).data('selected');
            $(this).data('selected', ! selected);

            c = [];
            $.each(self.$ctn.find('.color-box'), function(idx, val) {
                if ($(val).data('selected') === true) {
                    c = _.union(c, $.parseJSON(self.gData[$(val).data('id')].attributes));
                }
            });

            var currentUri = new Uri(document.URL);
            currentUri.deleteQueryParam('color[]');
            $.each(c, function(idx, val) {
                currentUri.addQueryParam('color[]', val);
            });
            window.location = currentUri.toString();

            return false;
        });
    };

    return c;
})(jQuery);
var acf;

(function($) {
    $(function() {
        acf = new ACF($('.acf-container .filters'), acfJson, storeview);
    });
})(jQuery);