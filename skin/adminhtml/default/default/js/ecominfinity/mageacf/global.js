jQuery.noConflict();

var ACF = (function($) {
    var c = function(url, formKey, data) {
        this.url = url;
        this.formKey = formKey;
        this.gData = data;

        this.ajax = function(url, data, callback) {
            $.extend(data, {'form_key': this.formKey});
            $.ajax({
                url: url,
                data: data,
                type: 'POST',
                beforeSend: function() { $.fancybox.showLoading(); }
            }).done(function(response) {
                callback(response);
                $.fancybox.hideLoading();
            });
        };
    };

    c.prototype.getData = function() {
        return this.gData;
    };

    c.prototype.create = function(name, color, store_view, list, callback) {
        var url = this.url.create;
        var data = {
            name: name,
            color: color,
            storeview: store_view,
            list: list
        };
        this.ajax(url, data, function(response) {
            callback(response);
            var d = $.parseJSON(response);
            this.gData[d.entity_id] = d;
        });
    };

    c.prototype.delete = function(id, callback) {
        var url = this.url + 'delete';
        var data = {
            id: id
        };
        this.ajax(url, data, callback);
    };

    return c;

})(jQuery);
var acf;

(function($) {
    $(function() {

        acf = new ACF(acfBaseUrl, formKey, acfJson);

        // common UI update function
        var _groupOptionTemplate = '<option value="%s">%s</option>';
        var refresh = function(data) {
            var storeview = $('#select-store-view').val();
            var $groupSelect = $('#select-color-group').empty();

            $.each(data, function(idx, val) {
                if (val.store_view === storeview) {
                    $groupSelect.append(sprintf(_groupOptionTemplate, val.entity_id, val.name));
                }
            });
        };
        refresh(acf.getData());

        // storeview select action 
        $('#select-store-view').change(function() {
            refresh(acf.getData());

            // TODO: update the preview
        });

        // color attribute hover effect
        $('#select-color-attribute').on('mouseenter', 'option', function(e) {
            var code = $(this).data('code');
            var name = $(this).html();
            $('.color-attribute-preview .color-box').css('background', code);
            $('.color-attribute-preview .name').html(name);
            $(this).css('background', '#ddd');
        });

        $('#select-color-attribute').on('mouseleave', 'option', function(e) {
            $(this).css('background', '');
        });

        // color group select action
        $('#select-color-group').change(function() {
            var id = $(this).val(),
                data = acf.getData(),
                entry = data[id],
                name = entry.name,
                color = entry.color,
                list = entry.attributes;

            var $selectColorAttribute = $('#select-color-attribute');

            $('#input-group-name').val(name);
            $('#input-group-color-code').val(color);
            $selectColorAttribute.find('option').attr('selected', false);

            // show list
            if (list.length > 0) {
                list = $.parseJSON(list);
                $.each(list, function(idx, val) {
                    $selectColorAttribute.find('option[value="'+val+'"]').attr('selected', 'selected');
                });
            }

            $('.modify-panel').show();
            $('.create-panel').hide();
        });

        // create new action
        $('.btn-create-new').on('click', function() {
            $('#input-group-name').val('');
            $('#input-group-color-code').val('');
            $('#select-color-group').find('option').attr('selected', false);
            $('#select-color-attribute').find('option').attr('selected', false);
            $('.modify-panel').hide();
            $('.create-panel').show();
            return false;
        });

        $('.create-panel .btn-action').on('click', function() {
            var name = $('#input-group-name').val(),
                color = $('#input-group-color-code').val(),
                storeView = $('#select-store-view').val(),
                list = $('#select-color-attribute').val();
            acf.create(name, color, storeView, list, function(response) {
                console.log(response);
            });
            return false;
        });

        $('.create-panel .btn-cancel').on('click', function() {
            $('.create-panel').hide();
            return false;
        });
    });
})(jQuery);