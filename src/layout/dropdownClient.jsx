import { classNames } from "primereact/utils";

const TRANSITIONS = {
  overlay: {
    enterFromClass: "opacity-0 scale-75",
    enterActiveClass:
      "transition-transform transition-opacity duration-100 ease-in",
    leaveActiveClass: "transition-opacity duration-100 ease-linear",
    leaveToClass: "opacity-0",
  },
};

export const dropdownClient = {
  root: ({ props }) => ({
    className: classNames(
      "cursor-pointer inline-flex relative select-none",
      "bg-white border-0 border-b-1  border-sky-600 transition-colors duration-100 ease-in-out rounded-none ",
      "dark:bg-gray-900 dark:border-blue-400 dark:hover:border-blue-300",
      "w-full md:w-56",
      "hover:border-blue-500 focus:outline-none focus:outline-offset-0 focus:shadow-[0_0_0_0.2rem_rgba(191,219,254,1)] dark:focus:shadow-[0_0_0_0.2rem_rgba(147,197,253,0.5)]",
      {
        "opacity-60 select-none pointer-events-none cursor-default":
          props.disabled,
      }
    ),
  }),
  input: ({ props }) => ({
    className: classNames(
      "cursor-pointer block flex flex-auto overflow-hidden overflow-ellipsis whitespace-nowrap relative",
      "bg-transparent border-0 text-gray-800",
      "dark:text-white/80",
      "p-3 transition duration-200 bg-transparent rounded appearance-none font-sans text-base",
      "focus:outline-none focus:shadow-none",
      { "pr-7": props.showClear }
    ),
  }),
  trigger: {
    className: classNames(
      "flex items-center justify-center shrink-0",
      "bg-transparent text-gray-500 w-12 rounded-tr-lg rounded-br-lg"
    ),
  },
  wrapper: {
    className: classNames(
      "max-h-[200px] overflow-auto",
      "bg-white text-gray-700 border-0 rounded-md shadow-lg",
      "dark:bg-gray-900 dark:text-white/80",
      "[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
    ),
  },
  list: "py-3 list-none m-0",
  item: ({ context }) => ({
    className: classNames(
      "cursor-pointer font-normal overflow-hidden relative whitespace-nowrap",
      "m-0 p-3 border-0  transition-shadow duration-200 rounded-none",
      "dark:text-white/80 dark:hover:bg-gray-800",
      "hover:text-sky-700 hover:bg-sky-200",
      {
        "text-gray-700": !context.focused && !context.selected,
        "bg-gray-300 text-gray-700 dark:text-white/80 dark:bg-gray-800/90":
          context.focused && !context.selected,
        "bg-blue-400 text-blue-700 dark:bg-blue-400 dark:text-white/80":
          context.focused && context.selected,
        "bg-blue-50 text-blue-700 dark:bg-blue-300 dark:text-white/80":
          !context.focused && context.selected,
        "opacity-60 select-none pointer-events-none cursor-default":
          context.disabled,
      }
    ),
  }),
  itemgroup: {
    className: classNames(
      "m-0 p-3 text-gray-800 bg-white font-bold",
      "dark:bg-gray-900 dark:text-white/80",
      "cursor-auto"
    ),
  },
  header: {
    className: classNames(
      "p-3 border-b border-gray-300 text-gray-700 bg-gray-100 mt-0 rounded-tl-lg rounded-tr-lg",
      "dark:bg-gray-800 dark:text-white/80 dark:border-blue-900/40"
    ),
  },
  filtercontainer: "relative",
  filterinput: {
    className: classNames(
      "pr-7 -mr-7",
      "w-full",
      "font-sans text-base text-gray-700 bg-white py-3 px-3 border border-gray-300 transition duration-200 rounded-lg appearance-none",
      "dark:bg-gray-900 dark:border-blue-900/40 dark:hover:border-blue-300 dark:text-white/80",
      "hover:border-blue-500 focus:outline-none focus:outline-offset-0 focus:shadow-[0_0_0_0.2rem_rgba(191,219,254,1)] dark:focus:shadow-[0_0_0_0.2rem_rgba(147,197,253,0.5)]"
    ),
  },
  filtericon: "-mt-2 absolute top-1/2",
  clearicon: "text-gray-500 right-12 -mt-2 absolute top-1/2",
  transition: TRANSITIONS.overlay,
};
