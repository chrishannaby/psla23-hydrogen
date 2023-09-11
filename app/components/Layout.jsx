import {useParams, Form, Await, useMatches} from '@remix-run/react';
import {useWindowScroll} from 'react-use';
import {Disclosure} from '@headlessui/react';
import {Suspense, useEffect, useMemo} from 'react';
import {CartForm} from '@shopify/hydrogen';
import {
  Drawer,
  useDrawer,
  Text,
  Input,
  IconLogin,
  IconAccount,
  IconBag,
  IconSearch,
  Heading,
  IconMenu,
  IconCaret,
  Section,
  CountrySelector,
  Cart,
  CartLoading,
  Link,
} from '~/components';
import {useIsHomePath} from '~/lib/utils';
import {useIsHydrated} from '~/hooks/useIsHydrated';
import {useCartFetchers} from '~/hooks/useCartFetchers';

export function Layout({children, layout}) {
  const {headerMenu, footerMenu} = layout;
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <div className="">
          <a href="#mainContent" className="sr-only">
            Skip to content
          </a>
        </div>
        {headerMenu && <Header title={layout.shop.name} menu={headerMenu} />}
        <main role="main" id="mainContent" className="flex-grow">
          {children}
        </main>
      </div>
      {footerMenu && <Footer menu={footerMenu} />}
    </>
  );
}

function Header({title, menu}) {
  const isHome = useIsHomePath();

  const {
    isOpen: isCartOpen,
    openDrawer: openCart,
    closeDrawer: closeCart,
  } = useDrawer();

  const {
    isOpen: isMenuOpen,
    openDrawer: openMenu,
    closeDrawer: closeMenu,
  } = useDrawer();

  const addToCartFetchers = useCartFetchers(CartForm.ACTIONS.LinesAdd);

  // toggle cart drawer when adding to cart
  useEffect(() => {
    if (isCartOpen || !addToCartFetchers.length) return;
    openCart();
  }, [addToCartFetchers, isCartOpen, openCart]);

  return (
    <>
      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
      {menu && (
        <MenuDrawer isOpen={isMenuOpen} onClose={closeMenu} menu={menu} />
      )}
      <DesktopHeader
        isHome={isHome}
        title={title}
        menu={menu}
        openCart={openCart}
      />
      <MobileHeader
        isHome={isHome}
        title={title}
        openCart={openCart}
        openMenu={openMenu}
      />
    </>
  );
}

function CartDrawer({isOpen, onClose}) {
  const [root] = useMatches();

  return (
    <Drawer open={isOpen} onClose={onClose} heading="Cart" openFrom="right">
      <div className="grid">
        <Suspense fallback={<CartLoading />}>
          <Await resolve={root.data?.cart}>
            {(cart) => <Cart layout="drawer" onClose={onClose} cart={cart} />}
          </Await>
        </Suspense>
      </div>
    </Drawer>
  );
}

export function MenuDrawer({isOpen, onClose, menu}) {
  return (
    <Drawer open={isOpen} onClose={onClose} openFrom="left" heading="Menu">
      <div className="grid">
        <MenuMobileNav menu={menu} onClose={onClose} />
      </div>
    </Drawer>
  );
}

function MenuMobileNav({menu, onClose}) {
  return (
    <nav className="grid gap-4 p-6 sm:gap-6 sm:px-12 sm:py-8">
      {/* Top level menu items */}
      {(menu?.items || []).map((item) => (
        <span key={item.id} className="block">
          <Link
            to={item.to}
            target={item.target}
            onClick={onClose}
            className={({isActive}) =>
              isActive ? 'pb-1 border-b -mb-px' : 'pb-1'
            }
          >
            <Text as="span" size="copy">
              {item.title}
            </Text>
          </Link>
        </span>
      ))}
    </nav>
  );
}

function MobileHeader({title, isHome, openCart, openMenu}) {
  // useHeaderStyleFix(containerStyle, setContainerStyle, isHome);

  const params = useParams();

  return (
    <header
      role="banner"
      className={`${
        isHome ? 'bg-white text-black' : 'bg-white text-black'
      } flex lg:hidden items-center h-nav sticky backdrop-blur-lg z-40 top-0 justify-between w-full leading-none gap-4 px-4 md:px-8`}
    >
      <div className="flex items-center justify-start w-full gap-4">
        <button
          onClick={openMenu}
          className="relative flex items-center justify-center w-8 h-8"
        >
          <IconMenu />
        </button>
        <Form
          method="get"
          action={params.locale ? `/${params.locale}/search` : '/search'}
          className="items-center gap-2 sm:flex"
        >
          <button
            type="submit"
            className="relative flex items-center justify-center w-8 h-8"
          >
            <IconSearch />
          </button>
          <Input
            className={
              isHome
                ? 'focus:border-contrast/20 dark:focus:border-primary/20'
                : 'focus:border-primary/20'
            }
            type="search"
            variant="minisearch"
            placeholder="Search"
            name="q"
          />
        </Form>
      </div>

      <Link to="/" className="w-72">
        <img src="/images/logo.png" className="w-full h-auto" />
      </Link>

      <div className="flex items-center justify-end w-full gap-4">
        <AccountLink className="relative flex items-center justify-center w-8 h-8" />
        <CartCount isHome={isHome} openCart={openCart} />
      </div>
    </header>
  );
}

function DesktopHeader({isHome, menu, openCart, title}) {
  const params = useParams();
  const {y} = useWindowScroll();
  return (
    <header
      role="banner"
      className={`${isHome ? 'bg-white text-black ' : 'bg-white text-black'} ${
        !isHome && y > 50 && ' shadow-lightHeader'
      } hidden h-nav lg:flex items-center sticky transition duration-300 backdrop-blur-lg z-40 top-0 justify-between w-full leading-none gap-8 px-12 py-8`}
    >
      <div className="flex gap-12 items-center justify-between w-full">
        {/*         <Link className="font-bold" to="/" prefetch="intent">
          {title}
        </Link> */}
        <nav className="flex gap-8">
          {/* Top level menu items */}
          {(menu?.items || []).map((item) => (
            <Link
              key={item.id}
              to={item.to}
              target={item.target}
              prefetch="intent"
              className={({isActive}) =>
                isActive ? 'pb-1 border-b -mb-px' : 'pb-1'
              }
            >
              {item.title}
            </Link>
          ))}
        </nav>
        <Link to="/" className="w-72">
          <img src="/images/logo.png" className="w-full h-auto" />
        </Link>
        <div className="flex items-center gap-1">
          <Form
            method="get"
            action={params.locale ? `/${params.locale}/search` : '/search'}
            className="flex items-center gap-2"
          >
            <Input
              className={
                isHome
                  ? 'focus:border-contrast/20 dark:focus:border-primary/20'
                  : 'focus:border-primary/20'
              }
              type="search"
              variant="minisearch"
              placeholder="Search"
              name="q"
            />
            <button
              type="submit"
              className="relative flex items-center justify-center w-8 h-8 focus:ring-primary/5"
            >
              <IconSearch />
            </button>
          </Form>
          <AccountLink className="relative flex items-center justify-center w-8 h-8 focus:ring-primary/5" />
          <CartCount isHome={isHome} openCart={openCart} />
        </div>
      </div>
    </header>
  );
}

function AccountLink({className}) {
  const [root] = useMatches();
  const isLoggedIn = root.data?.isLoggedIn;
  return isLoggedIn ? (
    <Link to="/account" className={className}>
      <IconAccount />
    </Link>
  ) : (
    <Link to="/account/login" className={className}>
      <IconLogin />
    </Link>
  );
}

function CartCount({isHome, openCart}) {
  const [root] = useMatches();

  return (
    <Suspense fallback={<Badge count={0} dark={isHome} openCart={openCart} />}>
      <Await resolve={root.data?.cart}>
        {(cart) => (
          <Badge
            dark={isHome}
            openCart={openCart}
            count={cart?.totalQuantity || 0}
          />
        )}
      </Await>
    </Suspense>
  );
}

function Badge({openCart, dark, count}) {
  const isHydrated = useIsHydrated();

  const BadgeCounter = useMemo(
    () => (
      <>
        <IconBag />
        <div
          className={`${
            dark
              ? 'text-primary bg-contrast dark:text-contrast dark:bg-primary'
              : 'text-contrast bg-primary'
          } absolute bottom-1 right-1 text-[0.625rem] font-medium subpixel-antialiased h-3 min-w-[0.75rem] flex items-center justify-center leading-none text-center rounded-full w-auto px-[0.125rem] pb-px`}
        >
          <span>{count || 0}</span>
        </div>
      </>
    ),
    [count, dark],
  );

  return isHydrated ? (
    <button
      onClick={openCart}
      className="relative flex items-center justify-center w-8 h-8 focus:ring-primary/5"
    >
      {BadgeCounter}
    </button>
  ) : (
    <Link
      to="/cart"
      className="relative flex items-center justify-center w-8 h-8 focus:ring-primary/5"
    >
      {BadgeCounter}
    </Link>
  );
}

function Footer({menu}) {
  const isHome = useIsHomePath();
  const itemsCount = menu
    ? menu?.items?.length + 1 > 4
      ? 4
      : menu?.items?.length + 1
    : [];

  return (
    <>
      <div className="bg-black  text-white grid items-center justify-center ">
        <div className="px-48 py-12  ">
          <div className="text-center space-y-6">
            <h1 className="text-[2.7rem]">Stay in the know</h1>
            <div className="w-96 m-auto">
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Email"
              />
            </div>
            <h3>Follow us on social media</h3>
            <div>
              <div className="">
                <ul className="flex justify-between">
                  <li className="w-6">
                    <a
                      href="https://facebook.com/shopify"
                      className="link list-social__link"
                    >
                      <svg
                        aria-hidden="true"
                        focusable="false"
                        className="icon icon-facebook"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fill="currentColor"
                          d="M18 10.049C18 5.603 14.419 2 10 2c-4.419 0-8 3.603-8 8.049C2 14.067 4.925 17.396 8.75 18v-5.624H6.719v-2.328h2.03V8.275c0-2.017 1.195-3.132 3.023-3.132.874 0 1.79.158 1.79.158v1.98h-1.009c-.994 0-1.303.621-1.303 1.258v1.51h2.219l-.355 2.326H11.25V18c3.825-.604 6.75-3.933 6.75-7.951Z"
                        ></path>
                      </svg>
                      <span className="hidden">Facebook</span>
                    </a>
                  </li>
                  <li className="w-6">
                    <a
                      href="http://instagram.com/shopify"
                      className="link list-social__link"
                    >
                      <svg
                        aria-hidden="true"
                        focusable="false"
                        className="icon icon-instagram"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fill="currentColor"
                          fillRule="evenodd"
                          d="M13.23 3.492c-.84-.037-1.096-.046-3.23-.046-2.144 0-2.39.01-3.238.055-.776.027-1.195.164-1.487.273a2.43 2.43 0 0 0-.912.593 2.486 2.486 0 0 0-.602.922c-.11.282-.238.702-.274 1.486-.046.84-.046 1.095-.046 3.23 0 2.134.01 2.39.046 3.229.004.51.097 1.016.274 1.495.145.365.319.639.602.913.282.282.538.456.92.602.474.176.974.268 1.479.273.848.046 1.103.046 3.238.046 2.134 0 2.39-.01 3.23-.046.784-.036 1.203-.164 1.486-.273.374-.146.648-.329.921-.602.283-.283.447-.548.602-.922.177-.476.27-.979.274-1.486.037-.84.046-1.095.046-3.23 0-2.134-.01-2.39-.055-3.229-.027-.784-.164-1.204-.274-1.495a2.43 2.43 0 0 0-.593-.913 2.604 2.604 0 0 0-.92-.602c-.284-.11-.703-.237-1.488-.273ZM6.697 2.05c.857-.036 1.131-.045 3.302-.045 1.1-.014 2.202.001 3.302.045.664.014 1.321.14 1.943.374a3.968 3.968 0 0 1 1.414.922c.41.397.728.88.93 1.414.23.622.354 1.279.365 1.942C18 7.56 18 7.824 18 10.005c0 2.17-.01 2.444-.046 3.292-.036.858-.173 1.442-.374 1.943-.2.53-.474.976-.92 1.423a3.896 3.896 0 0 1-1.415.922c-.51.191-1.095.337-1.943.374-.857.036-1.122.045-3.302.045-2.171 0-2.445-.009-3.302-.055-.849-.027-1.432-.164-1.943-.364a4.152 4.152 0 0 1-1.414-.922 4.128 4.128 0 0 1-.93-1.423c-.183-.51-.329-1.085-.365-1.943C2.009 12.45 2 12.167 2 10.004c0-2.161 0-2.435.055-3.302.027-.848.164-1.432.365-1.942a4.44 4.44 0 0 1 .92-1.414 4.18 4.18 0 0 1 1.415-.93c.51-.183 1.094-.33 1.943-.366Zm.427 4.806a4.105 4.105 0 1 1 5.805 5.805 4.105 4.105 0 0 1-5.805-5.805Zm1.882 5.371a2.668 2.668 0 1 0 2.042-4.93 2.668 2.668 0 0 0-2.042 4.93Zm5.922-5.942a.958.958 0 1 1-1.355-1.355.958.958 0 0 1 1.355 1.355Z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                      <span className="hidden">Instagram</span>
                    </a>
                  </li>
                  <li className="w-6">
                    <a
                      href="https://www.youtube.com/shopify"
                      className="link list-social__link"
                    >
                      <svg
                        aria-hidden="true"
                        focusable="false"
                        className="icon icon-youtube"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fill="currentColor"
                          d="M18.16 5.87c.34 1.309.34 4.08.34 4.08s0 2.771-.34 4.08a2.125 2.125 0 0 1-1.53 1.53c-1.309.34-6.63.34-6.63.34s-5.321 0-6.63-.34a2.125 2.125 0 0 1-1.53-1.53c-.34-1.309-.34-4.08-.34-4.08s0-2.771.34-4.08a2.173 2.173 0 0 1 1.53-1.53C4.679 4 10 4 10 4s5.321 0 6.63.34a2.173 2.173 0 0 1 1.53 1.53ZM8.3 12.5l4.42-2.55L8.3 7.4v5.1Z"
                        ></path>
                      </svg>
                      <span className="hidden">YouTube</span>
                    </a>
                  </li>
                  <li className="w-6">
                    <a
                      href="https://tiktok.com/@shopify"
                      className="link list-social__link"
                    >
                      <svg
                        aria-hidden="true"
                        focusable="false"
                        className="icon icon-tiktok"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fill="currentColor"
                          d="M10.511 1.705h2.74s-.157 3.51 3.795 3.768v2.711s-2.114.129-3.796-1.158l.028 5.606A5.073 5.073 0 1 1 8.213 7.56h.708v2.785a2.298 2.298 0 1 0 1.618 2.205L10.51 1.705Z"
                        ></path>
                      </svg>
                      <span className="hidden">TikTok</span>
                    </a>
                  </li>
                  <li className="w-6">
                    <a
                      href="https://twitter.com/shopify"
                      className="link list-social__link"
                    >
                      <svg
                        aria-hidden="true"
                        focusable="false"
                        className="icon icon-twitter"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fill="currentColor"
                          d="M18.608 4.967a7.364 7.364 0 0 1-1.758 1.828c0 .05 0 .13.02.23l.02.232a10.014 10.014 0 0 1-1.697 5.565 11.023 11.023 0 0 1-2.029 2.29 9.13 9.13 0 0 1-2.832 1.607 10.273 10.273 0 0 1-8.94-.985c.342.02.613.04.834.04 1.647 0 3.114-.502 4.4-1.506a3.616 3.616 0 0 1-3.315-2.46c.528.128 1.08.107 1.597-.061a3.485 3.485 0 0 1-2.029-1.216 3.385 3.385 0 0 1-.803-2.23v-.03c.462.242.984.372 1.587.402A3.465 3.465 0 0 1 2.116 5.76c0-.612.14-1.205.452-1.798a9.723 9.723 0 0 0 3.214 2.612A10.044 10.044 0 0 0 9.88 7.649a3.013 3.013 0 0 1-.13-.804c0-.974.34-1.808 1.034-2.49a3.466 3.466 0 0 1 2.561-1.035 3.505 3.505 0 0 1 2.551 1.104 6.812 6.812 0 0 0 2.24-.853 3.415 3.415 0 0 1-1.547 1.948 7.732 7.732 0 0 0 2.02-.542v-.01Z"
                        ></path>
                      </svg>
                      <span className="hidden">Twitter</span>
                    </a>
                  </li>
                  <li className="w-6">
                    <a
                      href="https://pinterest.com/shopify"
                      className="link list-social__link"
                    >
                      <svg
                        aria-hidden="true"
                        focusable="false"
                        className="icon icon-pinterest"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fill="currentColor"
                          d="M10 2.01c2.124.01 4.16.855 5.666 2.353a8.087 8.087 0 0 1 1.277 9.68A7.952 7.952 0 0 1 10 18.04a8.164 8.164 0 0 1-2.276-.307c.403-.653.672-1.24.816-1.729l.567-2.2c.134.27.393.5.768.702.384.192.768.297 1.19.297.836 0 1.585-.24 2.248-.72a4.678 4.678 0 0 0 1.537-1.969c.37-.89.554-1.848.537-2.813 0-1.249-.48-2.315-1.43-3.227a5.061 5.061 0 0 0-3.65-1.374c-.893 0-1.729.154-2.478.461a5.023 5.023 0 0 0-3.236 4.552c0 .72.134 1.355.413 1.902.269.538.672.922 1.22 1.152.096.039.182.039.25 0 .066-.028.114-.096.143-.192l.173-.653c.048-.144.02-.288-.105-.432a2.257 2.257 0 0 1-.548-1.565 3.803 3.803 0 0 1 3.976-3.861c1.047 0 1.863.288 2.44.855.585.576.883 1.315.883 2.228 0 .768-.106 1.479-.317 2.122a3.813 3.813 0 0 1-.893 1.556c-.384.384-.836.576-1.345.576-.413 0-.749-.144-1.018-.451-.259-.307-.345-.672-.25-1.085.147-.514.298-1.026.452-1.537l.173-.701c.057-.25.086-.451.086-.624 0-.346-.096-.634-.269-.855-.192-.22-.451-.336-.797-.336-.432 0-.797.192-1.085.595-.288.394-.442.893-.442 1.499.005.374.063.746.173 1.104l.058.144c-.576 2.478-.913 3.938-1.037 4.36-.116.528-.154 1.153-.125 1.863A8.067 8.067 0 0 1 2 10.03c0-2.208.778-4.11 2.343-5.666A7.721 7.721 0 0 1 10 2.001v.01Z"
                        ></path>
                      </svg>
                      <span className="hidden">Pinterest</span>
                    </a>
                  </li>
                  <li className="w-6">
                    <a
                      href="https://www.snapchat.com/add/shopify"
                      className="link list-social__link"
                    >
                      <svg
                        aria-hidden="true"
                        focusable="false"
                        className="icon icon-snapchat"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fill="currentColor"
                          fillRule="evenodd"
                          d="M17.388 15.396a4.9 4.9 0 0 1-1.111.445c-.074.23-.236.564-.596.813-.361.252-.755.294-.9.308-.14.015-.313.021-.443.026l-.092.004c-.317.014-.624.042-.958.154l-.002.001a1.74 1.74 0 0 0-.331.168l-.138.085c-.14.087-.33.205-.497.298a4.582 4.582 0 0 1-2.321.602 4.552 4.552 0 0 1-2.315-.602c-.164-.091-.355-.21-.495-.297l-.14-.086a1.816 1.816 0 0 0-.338-.172 3.427 3.427 0 0 0-.96-.154 9.342 9.342 0 0 0-.09-.003c-.13-.006-.304-.013-.445-.027-.15-.016-.541-.06-.9-.31a1.556 1.556 0 0 1-.593-.809 4.814 4.814 0 0 1-1.112-.446 1.919 1.919 0 0 1-.628-.535 1.437 1.437 0 0 1-.21-1.306 1.51 1.51 0 0 1 .53-.724c.137-.104.27-.17.323-.196 1.23-.604 1.77-1.38 1.996-1.833l-.18-.118c-.167-.11-.342-.223-.438-.291-.252-.178-.572-.449-.779-.85a1.805 1.805 0 0 1-.087-1.473l.002-.005c.344-.922 1.2-1.14 1.704-1.14h.07c.004-.222.014-.45.033-.678A4.599 4.599 0 0 1 6.132 3.35l.007-.007a5.094 5.094 0 0 1 1.773-1.247 5.055 5.055 0 0 1 2.108-.394c2.272.008 3.522 1.273 3.855 1.655a4.598 4.598 0 0 1 1.176 2.884c.019.227.028.456.032.678h.088c.521.005 1.346.242 1.684 1.133l.005.012c.18.487.154 1.01-.09 1.477-.209.401-.531.672-.786.85a19.36 19.36 0 0 1-.402.267l-.209.138c.224.45.76 1.226 1.994 1.827l.01.004.008.004c.056.029.188.097.325.203.12.093.388.323.52.724.16.493.028.963-.207 1.292a1.91 1.91 0 0 1-.627.541l-.008.005Zm-3.315-5.268c.088-.083.33-.248.574-.41l.255-.169.084-.055a24.313 24.313 0 0 0 .217-.144l.018-.013.018-.012c.36-.25.514-.504.401-.811-.081-.214-.28-.295-.486-.295a.76.76 0 0 0-.194.02 3.192 3.192 0 0 0-.403.12 7.088 7.088 0 0 0-.179.068l-.013.005-.058.023c-.092.036-.176.069-.248.093-.033.011-.064.02-.091.027-.029.012-.057.012-.082.012-.117 0-.161-.053-.153-.196l.003-.048.017-.264a19.471 19.471 0 0 0 .03-.785v-.03a9.727 9.727 0 0 0-.03-.943 3.299 3.299 0 0 0-.85-2.102c-.199-.23-1.13-1.217-2.904-1.217a3.755 3.755 0 0 0-1.583.292c-.5.21-.951.527-1.32.93a3.299 3.299 0 0 0-.851 2.101 9.737 9.737 0 0 0-.026 1.198l.01.246c.01.224.022.422.033.576 0 .019.002.037.003.054.008.135-.032.192-.154.192l-.08-.008a1.104 1.104 0 0 1-.087-.025 4.983 4.983 0 0 1-.254-.096l-.054-.022a3.76 3.76 0 0 1-.072-.029 6.693 6.693 0 0 0-.123-.046l-.008-.003a3.09 3.09 0 0 0-.447-.128 1.16 1.16 0 0 0-.142-.011c-.207 0-.405.077-.486.295-.114.307.04.561.397.811a2.774 2.774 0 0 0 .089.061 18.537 18.537 0 0 0 .274.181l.238.156c.243.161.482.323.569.405.175.165.16.293.14.452l-.002.02c-.014.115-.304 1.492-1.926 2.641a6.342 6.342 0 0 1-.51.327 7.138 7.138 0 0 1-.428.228c-.141.07-.388.217.045.459.084.046.164.086.24.121h.001c.247.113.46.174.65.225l.035.01c.06.015.115.03.17.046.14.042.267.088.382.163.16.104.182.274.203.432.018.133.035.258.133.326.117.082.333.091.623.103.375.015.873.036 1.443.225.287.097.536.253.8.416.514.322 1.08.674 2.075.674 1 0 1.572-.356 2.087-.677.261-.162.508-.315.788-.409.572-.192 1.073-.212 1.448-.226.289-.011.503-.02.617-.102.101-.068.118-.193.135-.328.021-.157.044-.328.206-.434.116-.075.244-.121.388-.163a7.998 7.998 0 0 1 .2-.056 4.084 4.084 0 0 0 .642-.222c.08-.036.162-.077.248-.124.429-.242.186-.394.04-.468a7.185 7.185 0 0 1-.423-.223l-.01-.005a6.487 6.487 0 0 1-.5-.319c-1.629-1.145-1.916-2.526-1.93-2.649v-.002c-.024-.163-.044-.293.138-.465Zm-10.3 4.838h.002Zm.106-1.842h-.002Zm1.573-4.897Zm9.1-.012Zm1.818 7.167Zm-12.74-.003Z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                      <span className="hidden">Snapchat</span>
                    </a>
                  </li>
                  <li className="w-6">
                    <a
                      href="https://shopify.tumblr.com"
                      className="link list-social__link"
                    >
                      <svg
                        aria-hidden="true"
                        focusable="false"
                        className="icon icon-tumblr"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fill="currentColor"
                          fillRule="evenodd"
                          d="M11.997 18c-2.26 0-3.954-1.235-3.954-4.198V9.061H6V6.489C8.26 5.867 9.201 3.787 9.314 2h2.344v4.068h2.73V9.06h-2.73v4.128c0 1.235.584 1.667 1.516 1.667h1.318V18h-2.495Z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                      <span className="hidden">Tumblr</span>
                    </a>
                  </li>
                  <li className="w-6">
                    <a
                      href="https://vimeo.com/shopify"
                      className="link list-social__link"
                    >
                      <svg
                        aria-hidden="true"
                        focusable="false"
                        className="icon icon-vimeo"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fill="currentColor"
                          fillRule="evenodd"
                          d="M17.995 7.002C17.92 8.457 16.9 10.451 14.935 13c-2.039 2.653-3.763 3.988-5.187 3.988-.87 0-1.605-.81-2.205-2.429L6.33 10.121c-.45-1.62-.93-2.43-1.44-2.43-.12 0-.51.24-1.184.706L3 7.497l2.19-1.95c.989-.869 1.724-1.319 2.218-1.349 1.17-.135 1.89.66 2.16 2.37.3 1.844.495 2.998.6 3.448.344 1.53.704 2.294 1.11 2.294.314 0 .794-.495 1.424-1.5.49-.67.832-1.436 1.004-2.249.09-.87-.255-1.304-1.004-1.304-.36 0-.735.09-1.11.255.735-2.414 2.144-3.584 4.213-3.509 1.545.045 2.265 1.05 2.19 3Z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                      <span className="hidden">Vimeo</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/*       <Section
      divider={isHome ? 'none' : 'top'}
      as="footer"
      role="contentinfo"
      className={`grid min-h-[25rem] items-start grid-flow-row w-full gap-6 py-8 px-6 md:px-8 lg:px-12 md:gap-8 lg:gap-12 grid-cols-1 md:grid-cols-2 lg:grid-cols-${itemsCount}
        bg-primary dark:bg-contrast dark:text-primary text-contrast overflow-hidden`}
    >
      <FooterMenu menu={menu} />
      <CountrySelector />
      <div
        className={`self-end pt-8 opacity-50 md:col-span-2 lg:col-span-${itemsCount}`}
      >
        &copy; {new Date().getFullYear()} / Shopify, Inc. Hydrogen is an MIT
        Licensed Open Source project.
      </div>
    </Section> */}
      </div>
      <div className="py-20 px-24 bg-black text-white border-t border-gray-800">
        <div className="flex justify-between w-full items-center">
          <div className="w-72">
            <CountrySelector />
          </div>
          <p className="text-xs">© 2023, Hydrogen.shop Powered by Shopify</p>
        </div>
      </div>
    </>
  );
}

function FooterLink({item}) {
  if (item.to.startsWith('http')) {
    return (
      <a href={item.to} target={item.target} rel="noopener noreferrer">
        {item.title}
      </a>
    );
  }

  return (
    <Link to={item.to} target={item.target} prefetch="intent">
      {item.title}
    </Link>
  );
}

function FooterMenu({menu}) {
  const styles = {
    section: 'grid gap-4',
    nav: 'grid gap-2 pb-6',
  };

  return (
    <>
      {(menu?.items || []).map((item) => (
        <section key={item.id} className={styles.section}>
          <Disclosure>
            {({open}) => (
              <>
                <Disclosure.Button className="text-left md:cursor-default">
                  <Heading className="flex justify-between" size="lead" as="h3">
                    {item.title}
                    {item?.items?.length > 0 && (
                      <span className="md:hidden">
                        <IconCaret direction={open ? 'up' : 'down'} />
                      </span>
                    )}
                  </Heading>
                </Disclosure.Button>
                {item?.items?.length > 0 ? (
                  <div
                    className={`${
                      open ? `max-h-48 h-fit` : `max-h-0 md:max-h-fit`
                    } overflow-hidden transition-all duration-300`}
                  >
                    <Suspense data-comment="This suspense fixes a hydration bug in Disclosure.Panel with static prop">
                      <Disclosure.Panel static>
                        <nav className={styles.nav}>
                          {item.items.map((subItem) => (
                            <FooterLink key={subItem.id} item={subItem} />
                          ))}
                        </nav>
                      </Disclosure.Panel>
                    </Suspense>
                  </div>
                ) : null}
              </>
            )}
          </Disclosure>
        </section>
      ))}
    </>
  );
}
