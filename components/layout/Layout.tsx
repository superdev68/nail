import React, { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import Head from "next/head";
import { ThemeProvider } from "next-themes";
import NextNProgress from "nextjs-progressbar";
import { ToastContainer } from "react-toastify";
import store from "../../store";
import { bookingActions } from "../../store/booking-slice";
import { locationList, merchantToday } from "../../utilities/bookingUtils";
import { initMerchantDataFromBackend } from "../../services/api";
import Header from "../header";
import Footer from "../footer";
import IconSprite from "../UI/IconSprite";
import Modal from "../UI/Modal";
import FloatingContact from "../UI/FloatingContact";

const BackendDataSync: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const td = merchantToday();
    dispatch(bookingActions.setToday(td));
    dispatch(bookingActions.selectDate(td));

    initMerchantDataFromBackend().then((success) => {
      if (success) {
        if (locationList.length > 0) {
          dispatch(bookingActions.selectLocation(locationList[0].id));
        }
        dispatch(bookingActions.triggerReload({ silent: true }));
      }
    });
  }, [dispatch]);

  return null;
};

const Layout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <Provider store={store}>
      <BackendDataSync />
      <ThemeProvider enableSystem={false} attribute="class" defaultTheme="light">
        <Head>
          <title>Đặt lịch hẹn với Nail Room - Mit’s House</title>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, viewport-fit=cover"
          />
          <meta
            property="og:image"
            content="https://salonhero-wasabi.becdn.net/Others/559/559-80fa0j3n05s0-300x300.png"
          />
          <meta
            name="description"
            content="Đặt lịch hẹn nhanh chóng và thuận tiện dành riêng cho khách hàng của Nail Room - Mit’s House. Hãy đặt lịch để được chăm sóc và hỗ trợ tốt nhất."
          />
          <meta
            name="keywords"
            content="đặt lịch hẹn, quản lý lịch hẹn, quản lý spa, chăm sóc khách hàng, spa, nail, salon, phần mềm quản lý spa, booking, salonhero"
          />
          <link
            rel="icon"
            href="https://salonhero-wasabi.becdn.net/Others/559/559-80fa0j3n05s0-300x300.png"
          />
        </Head>
        <IconSprite />
        <NextNProgress height={3} color="rgb(131, 69, 6)" />
        <Header />
        <main className="wrap">{children}</main>
        <Footer />
        <FloatingContact />
        <Modal />
        <ToastContainer
          autoClose={2000}
          hideProgressBar={true}
          rtl={false}
          position={"top-right"}
        />
      </ThemeProvider>
    </Provider>
  );
};

export default Layout;
