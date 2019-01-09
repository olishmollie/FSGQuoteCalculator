class QuoteItem extends Component {
  constructor(opts) {
    super();
    this.quote = opts.quote;
    this.index = opts.index;
    this.product = opts.product;
    this.onchange = opts.onchange;
    this.ondelete = opts.ondelete;
    this.onerror = opts.onerror;

    this.flash = new Flash();
  }

  customizeRoute() {
    return (
      "#/products/" + this.product.shirt.id + "?productId=" + this.product.id
    );
  }

  handleInputChange(size, value) {
    if (!isNaN(value)) {
      this.product.quantities[size] = parseInt(value);
      this.product.quantity = this.product.quantityFromSizes();
      if (this.product.quantity >= this.product.minQuantity()) {
        this.quote.updateProduct(this.product.id, this.product);
        this.flash.hide();
        this.onchange();
      }
    } else {
      this.flash.show(
        "danger",
        "A minimum of " + this.product.minQuantity() + " shirts are required."
      );
      this.onerror();
    }
  }

  render() {
    return super.render(
      jsml.div(
        {
          className: "media"
        },
        jsml.component(this.flash),
        jsml.div(
          {
            className: "media-body"
          },
          jsml.a(
            {
              href: this.customizeRoute()
            },
            jsml.h5(
              {
                className: "quote-item-title"
              },
              jsml.strong({
                className: "quote-item-index mr-2",
                innerText: this.index + 1 + "."
              }),
              jsml.text(this.product.shirt.name)
            )
          ),
          jsml.button({
            className: "trash-button float-right btn btn-danger",
            innerText: "TRASH",
            onclick: () => {
              this.quote.remove(this.product);
              this.ondelete();
            }
          }),
          ...this.product.shirt.availableSizes.map(size => {
            return jsml.div(
              {},
              jsml.label({}, jsml.text(size)),
              jsml.component(
                new ControlledInput({
                  value: this.product.quantities[size],
                  onchange: value => {
                    this.handleInputChange(size, parseInt(value));
                  },
                  onblur: () => {
                    this.handleInputChange(size, this.product.quantities[size]);
                  }
                })
              )
            );
          })
        )
      )
    );
  }
}
