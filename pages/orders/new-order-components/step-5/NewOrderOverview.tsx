import Checkbox from '../../../../components/checkbox/Checkbox';
import Button from '../../../../components/util-components/Button';
import InputField from '../../../../components/util-components/InputField';
import { useAlertModal } from '../../../../store/modals/alert-modal-context';
import { useNewOrder } from '../../../../store/new-order-context';
import './newOrderOverview.scss';

interface NewOrderOverviewPropTypes {
  onReset: () => void;
}

function NewOrderOverview({ onReset }: NewOrderOverviewPropTypes) {
  const { newOrderData, setNewOrderData, resetOrderDataHandler } =
    useNewOrder();
  const { showAlert } = useAlertModal();
  function handleOnReset() {
    console.log('> Resetting data');
    resetOrderDataHandler();

    console.log('> Running on reset');
    onReset();
  }
  return (
    <div>
      {/* BUYER INFORMATIONS */}
      <div className="new-order-buyer-information">
        <h3>Buyer Information</h3>
        <div className="new-order-inner-wrapper">
          <div className="grid-1-1">
            <p>Name:</p>
            <p>{newOrderData.buyer.name || 'N/A'}</p>
          </div>
          <div className="grid-1-1">
            <p>Address:</p>
            <p>{newOrderData.buyer.address || 'N/A'}</p>
          </div>
          <div className="grid-1-1">
            <p>Place:</p>
            <p>{newOrderData.buyer.place || 'N/A'}</p>
          </div>
          <div className="grid-1-1">
            <p>Phone:</p>
            <p>{newOrderData.buyer.phone || 'N/A'}</p>
          </div>
          <div className="grid-1-1">
            <p>Secondary phone:</p>
            <p>{newOrderData.buyer.phone2 || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* PRODUCTS LIST */}
      <div className="new-order-selected-products">
        <h3>Selected Products ({newOrderData.products.length})</h3>
        {newOrderData.products.map((product, index) => (
          <div
            key={index}
            className={`new-order-inner-wrapper${index !== 0 ? ' with-top-border' : ' new-order-first-product-in-list'} ${
              index % 2 === 0 ? 'new-order-products-even-bg' : ''
            }`}
          >
            <h4>
              {index + 1}) {product.name || 'N/A'}
            </h4>
            <div className="new-order-inner-wrapper">
              <div className="grid-1-1">
                <p>Category:</p>
                <p>{product.category || 'N/A'}</p>
              </div>
              <div className="grid-1-1">
                <p>Color:</p>
                <p>{product.selectedColor || 'N/A'}</p>
              </div>
              <div className="grid-1-1">
                <p>Size:</p>
                <p>{product.selectedSize || 'N/A'}</p>
              </div>
              <div className="grid-1-1">
                <p>Price:</p>
                <p>{`${product.price} rsd.` || 'N/A'}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* OTHER */}
      <div className="new-order-other-information-container">
        <h3>Reservation</h3>
        <div className="new-order-is-reservation">
          <Checkbox
            label="Yes"
            checked={newOrderData.reservation}
            onCheckedChange={() =>
              setNewOrderData((prev) => ({ ...prev, reservation: true }))
            }
          />
          <Checkbox
            label="No"
            checked={!newOrderData.reservation}
            onCheckedChange={() =>
              setNewOrderData((prev) => ({ ...prev, reservation: false }))
            }
          />
        </div>

        <h3>Other information</h3>
        <div className="new-order-other-information">
          <div className="grid-1-1">
            <p>Courier:</p>
            <p>{newOrderData.courier.name}</p>
          </div>
          <div className="grid-1-1">
            <p>Courier price:</p>
            <p>{newOrderData.courier.deliveryPrice} rsd.</p>
          </div>
          <div className="grid-1-1">
            <p>Products price:</p>
            <p>{newOrderData.productsPrice} rsd.</p>
          </div>
          <div className="grid-1-1">
            <p>Total price:</p>
            <p>{newOrderData.totalPrice} rsd.</p>
          </div>
        </div>
        <br />
        <hr />

        <div className="new-order-total-price-input-container">
          <InputField
            label="Custom price"
            backgroundColor="var(--primaryLight)"
            inputText={newOrderData.totalPrice.toString()}
            setInputText={(value) => {
              if (isNaN(Number(value))) {
                showAlert('Please enter a valid number!');
                return;
              }
              setNewOrderData((prev) => ({
                ...prev,
                totalPrice: Number(value),
              }));
            }}
            showClearBtn={true}
          />
        </div>
      </div>

      {/* BUTTONS */}
      <div className="new-order-controls">
        <Button
          label="Cancel and Reset"
          type="button"
          className="new-order-cancel-btn"
          onClick={handleOnReset}
        />
        <Button label="Add Order" type="button" className="new-order-add-btn" />
      </div>
    </div>
  );
}

export default NewOrderOverview;
