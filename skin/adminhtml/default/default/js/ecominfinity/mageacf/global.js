jQuery.noConflict();

var ACF = (function($) {
    var c = function(url, formKey) {
        this.url = url;
        this.formKey = formKey;
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

    c.prototype.create = function(name, color, store_view, list, callback) {
        var url = this.url.create;
        var data = {
            name: name,
            color: color,
            storeview: store_view
        };
        this.ajax(url, data, callback);
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

        acf = new ACF(acfBaseUrl, formKey);

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

        // create new action
        $('.btn-create-new').on('click', function() {
            $('#input-group-name').val('');
            $('#input-group-color-code').val('');
            $('#select-color-attribute').find('option').attr('selected', false);
            $('.modify-panel').hide();
            $('.create-panel').show();
            return false;
        });

        $('.create-panel .btn-action').on('click', function() {
            var name = $('#input-group-name').val(),
                color = $('#input-group-color-code').val(),
                storeView = $('#select-store-view').val(),
                list = null;
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