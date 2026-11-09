/**
 * @author      Andreas Knollmann
 * @copyright   2014-2025 Softwareentwicklung Andreas Knollmann
 * @license     http://www.opensource.org/licenses/mit-license.php MIT
 */

define([
    'jquery',
    'domReady',
    'priceBox',
    'addToCart'
], function ($, domReady) {
    'use strict';

    const globalOptions = {
        productId: 0,
        itemId: 0,
        steps: {},
        formIdentifier: '#product_addtocart_form',
        qtyIdentifier: '.box-tocart .field.qty #qty'
    };

    $.widget('mage.productQtySteps', {
        options: globalOptions,

        _create: function() {
        },

        _init: function() {
            const self = this;

            domReady(function() {
                const form = $(self.options.formIdentifier);
                let qty = $(self.options.qtyIdentifier, form);
                let name = 'qty_steps';
                let id = 'qty-steps';

                if (qty.length === 0 && self.options.itemId > 0) {
                    qty = $('#cart-' + self.options.itemId + '-qty');
                    name = 'qty_steps_' + self.options.itemId;
                    id = 'qty-steps-' + self.options.itemId;
                }

                const qtyValue = parseInt($(qty).val());

                $(qty).hide();

                const qtySelect = $('<select>', {
                    name: name,
                    id: id,
                    class: 'qty-steps',
                });

                let selected = false;
                $(self.options.steps).each(function(key, value) {
                    const qtySelectOption = $('<option>');
                    qtySelectOption.attr('value', value);
                    qtySelectOption.text(value);

                    if (parseInt(value) === qtyValue) {
                        qtySelectOption.attr('selected', 'selected');
                        selected = true;
                    }

                    qtySelect.append(qtySelectOption);
                });

                qtySelect.on('change', function() {
                    if ($(qty).val() !== $(this).val()) {
                        $(qty).val($(this).val());
                        $(qty).trigger('input');
                    }
                });

                $(qty).after(qtySelect);

                if (! selected) {
                    $(qty).val($(this).val());
                }

                $(qty).trigger('input');

                qtySelect.trigger('change');

                $('body').trigger('qty-steps-initialized', [qtySelect, qty]);
                form.trigger('form-qty-steps-initialized', [qtySelect, qty]);

                const priceBoxes = $('[data-role="priceBox"]');

                priceBoxes.on('price-box-initialized', function() {
                    const productId = $(this).data('product-id');

                    if (productId === self.options.productId) {
                        qtySelect.trigger('change');
                    }
                });
            });
        },
    });

    return $.mage.productQtySteps;
});
