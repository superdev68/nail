import type { NextPage } from "next";
import BookingView from "../components/booking";
import BranchesTab from "../components/branches";
import ServicesTab from "../components/services";

const Home: NextPage = () => {
  return (
    <>
      <BookingView />
      <BranchesTab />
      <ServicesTab />
    </>
  );
};

export default Home;
