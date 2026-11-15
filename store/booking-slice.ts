import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  IBookingSuccess,
  ISlotState,
  IWorkingHour,
  SectionOfDay,
  TabType,
} from "../lib/types";
import {
  defaultLocation,
  defaultSection,
  merchantToday,
  servicesIn,
} from "../utilities/bookingUtils";

export interface BookingState {
  tab: TabType;
  loc: number;
  region: string;
  locMore: boolean;
  today: string;
  date: string;
  time: string;
  section: SectionOfDay;
  services: number[];
  group: string;
  q: string;
  mq: string;
  opq: string;
  bq: string;
  op: number;
  guests: number;
  gender: "F" | "M";
  name: string;
  email: string;
  note: string;
  fieldErr: Record<string, boolean>;
  timeErr: boolean;
  errMsg: string;
  checking: boolean;
  submitting: boolean;
  success: IBookingSuccess | null;
  modal: string | null;
  slotState: ISlotState;
  todayHours: IWorkingHour | null;
  reloadKey: { n: number; silent: boolean };
}

const initialState: BookingState = {
  tab: "booking",
  loc: defaultLocation,
  region: "",
  locMore: false,
  today: merchantToday(),
  date: merchantToday(),
  time: "",
  section: defaultSection(false),
  services: [],
  group: "",
  q: "",
  mq: "",
  opq: "",
  bq: "",
  op: 0,
  guests: 1,
  gender: "F",
  name: "",
  email: "",
  note: "",
  fieldErr: {},
  timeErr: false,
  errMsg: "",
  checking: false,
  submitting: false,
  success: null,
  modal: null,
  slotState: { status: "loading", list: [], workingHours: null },
  todayHours: null,
  reloadKey: { n: 0, silent: false },
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setTab(state, action: PayloadAction<TabType>) {
      state.tab = action.payload;
    },
    selectLocation(state, action: PayloadAction<number | string>) {
      const id = parseInt(String(action.payload), 10);
      state.loc = id;
      state.op = 0;
      state.time = "";
      const available = servicesIn(id).map((p) => p.id);
      state.services = state.services.filter((x) => available.includes(x));
      state.group = "";
    },
    setRegion(state, action: PayloadAction<string>) {
      state.region = action.payload;
      state.locMore = false;
    },
    setLocMore(state, action: PayloadAction<boolean>) {
      state.locMore = action.payload;
    },
    setToday(state, action: PayloadAction<string>) {
      state.today = action.payload;
    },
    selectDate(state, action: PayloadAction<string>) {
      const dateStr = action.payload;
      state.date = dateStr;
      state.time = "";
      state.section = defaultSection(dateStr !== merchantToday());
    },
    setTime(state, action: PayloadAction<string>) {
      state.time = action.payload;
    },
    setSection(state, action: PayloadAction<SectionOfDay>) {
      state.section = action.payload;
    },
    toggleService(state, action: PayloadAction<number | string>) {
      const id = parseInt(String(action.payload), 10);
      if (state.services.includes(id)) {
        state.services = state.services.filter((x) => x !== id);
      } else {
        state.services.push(id);
      }
    },
    setServices(state, action: PayloadAction<number[]>) {
      state.services = action.payload;
    },
    setGroup(state, action: PayloadAction<string>) {
      state.group = action.payload;
    },
    setQ(state, action: PayloadAction<string>) {
      state.q = action.payload;
    },
    setMq(state, action: PayloadAction<string>) {
      state.mq = action.payload;
    },
    setOpq(state, action: PayloadAction<string>) {
      state.opq = action.payload;
    },
    setBq(state, action: PayloadAction<string>) {
      state.bq = action.payload;
    },
    setOp(state, action: PayloadAction<number>) {
      state.op = action.payload;
    },
    setGuests(state, action: PayloadAction<number>) {
      state.guests = Math.max(1, Math.min(20, action.payload));
    },
    setGender(state, action: PayloadAction<"F" | "M">) {
      state.gender = action.payload;
    },
    setName(state, action: PayloadAction<string>) {
      state.name = action.payload;
    },
    setEmail(state, action: PayloadAction<string>) {
      state.email = action.payload;
    },
    setNote(state, action: PayloadAction<string>) {
      state.note = action.payload;
    },
    setFieldErr(state, action: PayloadAction<Record<string, boolean>>) {
      state.fieldErr = action.payload;
    },
    setTimeErr(state, action: PayloadAction<boolean>) {
      state.timeErr = action.payload;
    },
    setErrMsg(state, action: PayloadAction<string>) {
      state.errMsg = action.payload;
    },
    setChecking(state, action: PayloadAction<boolean>) {
      state.checking = action.payload;
    },
    setSubmitting(state, action: PayloadAction<boolean>) {
      state.submitting = action.payload;
    },
    setSuccess(state, action: PayloadAction<IBookingSuccess | null>) {
      state.success = action.payload;
    },
    setModal(state, action: PayloadAction<string | null>) {
      state.modal = action.payload;
    },
    setSlotState(state, action: PayloadAction<ISlotState>) {
      state.slotState = action.payload;
    },
    setTodayHours(state, action: PayloadAction<IWorkingHour | null>) {
      state.todayHours = action.payload;
    },
    triggerReload(state, action: PayloadAction<{ silent: boolean }>) {
      state.reloadKey = {
        n: state.reloadKey.n + 1,
        silent: action.payload.silent,
      };
    },
    resetForNewBooking(state) {
      state.note = "";
      state.services = [];
      state.op = 0;
      state.time = "";
      state.fieldErr = {};
      state.timeErr = false;
      state.errMsg = "";
      state.success = null;
      state.reloadKey = { n: state.reloadKey.n + 1, silent: false };
    },
  },
});

export const bookingActions = bookingSlice.actions;
export default bookingSlice.reducer;
