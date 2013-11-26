jQuery.noConflict();

var ACF = (function($) {
    var c = function(url, formKey, data) {
        var _successMessageTemplate = '<ul class="messages"><li class="success-msg"><ul><li><span>%s</span></li></ul></li></ul>',
            _failedMessageTemplate = '<ul class="messages"><li class="error-msg"><ul><li><span>%s</span></li></ul></li></ul>';

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
                $.fancybox.hideLoading();

                // show default magento message
                var d = $.parseJSON(response);
                var $message = null;
                if (d.success === true) {
                    $message = $(sprintf(_successMessageTemplate, d.message));
                } else {
                    $message = $(sprintf(_failedMessageTemplate, d.data));
                }
                $('#messages').append($message);
                setTimeout(function() {
                    $message.fadeOut(500, function() {
                        $message.remove();
                    });
                }, 3000);

                callback(response);
            });
        };
    };

    c.prototype.getData = function() {
        return this.gData;
    };

    c.prototype.create = function(name, color, store_view, list, callback) {
        var self = this;
        var url = this.url.create;
        var data = {
            name: name,
            color: color,
            storeview: store_view,
            list: list
        };
        this.ajax(url, data, function(response) {
            var d = $.parseJSON(response);
            if (d.success === true) {
                self.gData[d.data.entity_id] = d.data;
                callback(d.data);
            }
        });
    };

    c.prototype.delete = function(id, callback) {
        var self = this;
        var url = this.url.delete;
        var data = {
            id: id
        };
        this.ajax(url, data, function(response) {
            var d = $.parseJSON(response);
            if (d.success === true) {
                delete self.gData[d.data.id];
                callback(d.data);
            }
        });
    };

    c.prototype.update = function(id, name, color, list, callback) {
        var self = this;
        var url = this.url.update;
        var data = {
            id: id,
            name: name,
            color: color,
            list: list
        };
        this.ajax(url, data, function(response) {
            var d = $.parseJSON(response);
            if (d.success === true) {
                self.gData[d.data.entity_id] = d.data;
                callback(d.data);
            }
        });
    };

    c.prototype.position = function(list, callback) {
        var self = this;
        var url = this.url.position;
        var data = {
            list: list
        };
        this.ajax(url, data, function(response) {
            var d = $.parseJSON(response);
            if (d.success === true) {
                list = d.data;
                $.each(list, function(idx, val) {
                    self.gData[idx].position = val;
                });
                callback(d.data);
            }
        });
    };

    return c;

})(jQuery);
var acf;

(function($) {
    $(function() {

        acf = new ACF(acfBaseUrl, formKey, acfJson);

        // common UI update function
        var _groupOptionTemplate = '<option value="%s">%s</option>',
            _colorAttrCountTemplate = '(%s / %s)',
            _previewColorTemplate = '<span class="color-box" data-id="%s"><span style="background: %s"></span></span>',
            _clearTemplate = '<div class="clear"></div>';
        var refresh = function(data) {
            var storeview = $('#select-store-view').val();
            var $groupSelect = $('#select-color-group').empty();

            data = _.sortBy(data, function(obj) { return -obj.position; });

            $.each(data, function(idx, val) {
                if (val.store_view === storeview) {
                    $groupSelect.append(sprintf(_groupOptionTemplate, val.entity_id, val.name));
                }
            });

            var $preview = $('.field.preview .content');
            $preview.empty();
            $.each(data, function(idx, val) {
                if (val.store_view === storeview) {
                    $preview.append(sprintf(_previewColorTemplate, val.entity_id, val.color));
                }
            });
            $preview.append(_clearTemplate);
            $preview.sortable({
                start: function(event, ui) {
                },
                stop: function(event, ui) {
                    var $preview = $('.field.preview .content .color-box');
                    var list = [];
                    $preview.each(function(idx, val) {
                        list.push($(val).data('id'));
                    });
                    acf.position(list, function(data) {
                        refresh(acf.getData());
                    });
                }
            });
        };
        refresh(acf.getData());

        // storeview select action 
        $('#select-store-view').change(function() {
            refresh(acf.getData());
        });

        // color attribute hover effect
        $('#select-color-attribute').on('mouseenter', 'option', function(e) {
            var code = $(this).data('code');
            var name = $(this).html();
            $('.color-attribute-preview .color-box span').css('background', code);
            $('.color-attribute-preview .name').html(name);
            $(this).css('background', '#ddd');
        });

        $('#select-color-attribute').on('mouseleave', 'option', function(e) {
            $(this).css('background', '');
        });

        // color attribute search action
        var $allColors = [];
        $('#select-color-attribute option').each(function(idx, val) {
            $allColors.push($(val).clone());
        });

        $('#input-search-color-attribute').keyup(function() {
            var needle = $(this).val();
            $('#select-color-attribute').empty();
            $.each($allColors, function(idx, val) {
                var text = $(val).html();
                if (text.toLowerCase().indexOf(needle.toLowerCase()) !== -1)  {
                    $('#select-color-attribute').append($(val).clone());
                }
            });
            $('#select-color-group').change();
        });

        // color group select action
        $('#select-color-group').change(function() {
            var id = $(this).val();
            if (typeof id === 'undefined' || id === null) return;

            var data = acf.getData(),
                entry = data[id],
                name = entry.name,
                color = entry.color,
                list = entry.attributes;

            var $selectColorAttribute = $('#select-color-attribute');

            $('#input-group-name').val(name);
            $('#input-group-color-selector').val(color);
            $('#input-group-color-code').val(color);
            $selectColorAttribute.find('option').attr('selected', false);

            // show list
            if (list.length > 0) {
                list = $.parseJSON(list);
                $.each(list, function(idx, val) {
                    $selectColorAttribute.find('option[value="'+val+'"]').attr('selected', 'selected');
                });
            }
            $('.color-attribute-count').html(
                sprintf(_colorAttrCountTemplate,
                        $selectColorAttribute.find('option[selected="selected"]').length,
                        $selectColorAttribute.find('option').length)
            );

            $('.modify-panel').show();
            $('.create-panel').hide();

            return false;
        });

        // color code input event
        $('#input-group-color-code').blur(function() {
            if (/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test($(this).val())) {
                $('#input-group-color-selector').val($(this).val());
                $(this).removeClass('error');
            } else {
                $(this).addClass('error');
            }
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
            acf.create(name, color, storeView, list, function(data) {
                refresh(acf.getData());
            });
            return false;
        });

        $('.create-panel .btn-cancel').on('click', function() {
            $('.create-panel').hide();
            return false;
        });

        // modify action
        $('.modify-panel .btn-delete').on('click', function() {
            var id = $('#select-color-group').val();
            acf.delete(id, function(data) {
                refresh(acf.getData());
            });
            return false;
        });

        $('.modify-panel .btn-update').on('click', function() {
            var id = $('#select-color-group').val(),
                name = $('#input-group-name').val(),
                color = $('#input-group-color-code').val(),
                list = $('#select-color-attribute').val();
            acf.update(id, name, color, list, function(data) {
                refresh(acf.getData());
            });
            return false;
        });
    });
})(jQuery);