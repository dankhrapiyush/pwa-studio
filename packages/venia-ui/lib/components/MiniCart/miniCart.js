import React, { Fragment } from 'react';
import { Lock as LockIcon } from 'react-feather';
import { bool, shape, string } from 'prop-types';

import { useScrollLock, Price } from '@magento/peregrine';
import { useMiniCart } from '@magento/peregrine/lib/talons/MiniCart/useMiniCart';
import { mergeClasses } from '@magento/venia-ui/lib/classify';

import Button from '../Button';
import Icon from '../Icon';
import ProductListing from './ProductListing';

import ShoppingBadOperations from './miniCart.gql';

import defaultClasses from './miniCart.css';

const Error = () => {
    return <div>TBD</div>;
};

/**
 * The MiniCart component shows a limited view of the user's cart.
 *
 * @param {Boolean} props.isOpen - Whether or not the MiniCart should be displayed.
 */
const MiniCart = React.forwardRef((props, ref) => {
    const { isOpen, setIsOpen } = props;

    // Prevent the page from scrolling in the background
    // when the MiniCart is open.
    useScrollLock(isOpen);

    const talonProps = useMiniCart({
        setIsOpen,
        ...ShoppingBadOperations
    });

    const {
        productListings,
        loading,
        error,
        totalQuantity,
        subTotal,
        handleRemoveItem,
        handleEditCart,
        handleProceedToCheckout
    } = talonProps;

    const classes = mergeClasses(defaultClasses, props.classes);
    const rootClass = isOpen ? classes.root_open : classes.root;
    const contentsClass = isOpen ? classes.contents_open : classes.contents;

    if (error) {
        return <Error error={error} />;
    }

    const header =
        loading || !subTotal ? (
            'Loading...'
        ) : (
            <Fragment>
                <span>{`${totalQuantity} Items`}</span>
                <span className={classes.price}>
                    <span>{'Subtotal: '}</span>
                    <Price
                        currencyCode={subTotal.currency}
                        value={subTotal.value}
                    />
                </span>
            </Fragment>
        );

    return (
        <aside className={rootClass}>
            {/* The Contents. */}
            <div ref={ref} className={contentsClass}>
                <div className={classes.header}>{header}</div>
                <div className={classes.body}>
                    <ProductListing
                        listings={productListings}
                        loading={loading}
                        handleRemoveItem={handleRemoveItem}
                    />
                </div>
                <div className={classes.footer}>
                    <Button
                        onClick={handleProceedToCheckout}
                        priority="high"
                        className={classes.checkout_button}
                        disabled={loading}
                    >
                        <Icon
                            size={16}
                            src={LockIcon}
                            classes={{ icon: classes.checkout_icon }}
                        />
                        {'SECURE CHECKOUT'}
                    </Button>
                    <Button
                        onClick={handleEditCart}
                        priority="high"
                        className={classes.edit_cart_button}
                        disabled={loading}
                    >
                        {'Edit Shopping Bag'}
                    </Button>
                </div>
            </div>
        </aside>
    );
});

export default MiniCart;

MiniCart.propTypes = {
    classes: shape({
        root: string,
        root_open: string,
        contents: string,
        contents_open: string,
        header: string,
        body: string,
        footer: string
    }),
    isOpen: bool
};
