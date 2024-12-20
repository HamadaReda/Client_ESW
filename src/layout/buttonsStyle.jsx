import { classNames } from "primereact/utils";

export const buttonsStyle = {
  root: ({ props, context }) => ({
    className: classNames(
      "items-center cursor-pointer inline-flex overflow-hidden relative select-none text-center align-bottom",
      "transition duration-200 ease-in-out",
      "focus:outline-none focus:outline-offset-0 focus:shadow-none dark:focus:shadow-none",
      {
        "text-white dark:text-whiten bg-blue-500 dark:bg-primary border border-blue-500 dark:border-primary hover:bg-blue-600 dark:hover:bg-blue-500 hover:border-blue-600 dark:hover:border-blue-500 focus:shadow-none dark:focus:shadow-none":
          !props.link &&
          props.severity === null &&
          !props.text &&
          !props.outlined &&
          !props.plain,
        "text-blue-600 bg-transparent border-transparent focus:shadow-none dark:focus:shadow-none":
          props.link,
      },
      {
        "focus:shadow-none dark:focus:shadow-none":
          props.severity === "secondary",
        "focus:shadow-none dark:focus:shadow-none":
          props.severity === "success",
        "focus:shadow-none dark:focus:shadow-none": props.severity === "info",
        "focus:shadow-none dark:focus:shadow-none":
          props.severity === "warning",
        "focus:shadow-none dark:focus:shadow-none": props.severity === "help",
        "focus:shadow-none dark:focus:shadow-none": props.severity === "danger",
      },
      {
        "text-white dark:text-whiten bg-gray-500 dark:bg-gray-400 border border-gray-500 dark:border-gray-400 hover:bg-gray-600 dark:hover:bg-gray-500 hover:border-gray-600 dark:hover:border-gray-500":
          props.severity === "secondary" &&
          !props.text &&
          !props.outlined &&
          !props.plain,
        "text-white dark:text-whiten bg-green-500 dark:bg-green-400 border border-green-500 dark:border-green-400 hover:bg-green-600 dark:hover:bg-green-500 hover:border-green-600 dark:hover:border-green-500":
          props.severity === "success" &&
          !props.text &&
          !props.outlined &&
          !props.plain,
        "text-white dark:text-whiten dark:bg-primary bg-blue-500 dark:bg-primary border border-blue-500 dark:border-blue-400 hover:bg-blue-600 hover:border-blue-600 dark:hover:bg-blue-500 dark:hover:border-blue-500":
          props.severity === "info" &&
          !props.text &&
          !props.outlined &&
          !props.plain,
        "text-white dark:text-whiten bg-orange-500 dark:bg-orange-400 border border-orange-500 dark:border-orange-400 hover:bg-orange-600 dark:hover:bg-orange-500 hover:border-orange-600 dark:hover:border-orange-500":
          props.severity === "warning" &&
          !props.text &&
          !props.outlined &&
          !props.plain,
        "text-white dark:text-whiten bg-purple-500 dark:bg-purple-400 border border-purple-500 dark:border-purple-400 hover:bg-purple-600 dark:hover:bg-purple-500 hover:border-purple-600 dark:hover:border-purple-500":
          props.severity === "help" &&
          !props.text &&
          !props.outlined &&
          !props.plain,
        "text-white dark:text-whiten bg-red-500 dark:bg-red-400 border border-red-500 dark:border-red-400 hover:bg-red-600 dark:hover:bg-red-500 hover:border-red-600 dark:hover:border-red-500":
          props.severity === "danger" &&
          !props.text &&
          !props.outlined &&
          !props.plain,
      },
      { "shadow-none": props.raised },
      { "rounded-md": !props.rounded, "rounded-full": props.rounded },
      {
        "bg-transparent border-transparent": props.text && !props.plain,
        "text-blue-500 dark:text-blue-400 hover:bg-blue-300/20":
          props.text &&
          (props.severity === null || props.severity === "info") &&
          !props.plain,
        "text-gray-500 dark:text-gray-400 hover:bg-gray-300/20":
          props.text && props.severity === "secondary" && !props.plain,
        "text-green-500 dark:text-green-400 hover:bg-green-300/20":
          props.text && props.severity === "success" && !props.plain,
        "text-orange-500 dark:text-orange-400 hover:bg-orange-300/20":
          props.text && props.severity === "warning" && !props.plain,
        "text-purple-500 dark:text-purple-400 hover:bg-purple-300/20":
          props.text && props.severity === "help" && !props.plain,
        "text-red-500 dark:text-red-400 hover:bg-red-300/20":
          props.text && props.severity === "danger" && !props.plain,
      },
      { "shadow-none": props.raised && props.text },
      {
        "text-gray-500 hover:bg-gray-300/20": props.plain && props.text,
        "text-gray-500 border border-gray-500 hover:bg-gray-300/20":
          props.plain && props.outlined,
        "text-white bg-gray-500 border border-gray-500 hover:bg-gray-600 hover:border-gray-600":
          props.plain && !props.outlined && !props.text,
      },
      {
        "bg-transparent border": props.outlined && !props.plain,
        "text-blue-500 dark:text-blue-400 border border-border-primary dark:border-primary hover:bg-blue-300/20":
          props.outlined &&
          (props.severity === null || props.severity === "info") &&
          !props.plain,
        "text-gray-500 dark:text-gray-400 border border-gray-500 dark:border-gray-400 hover:bg-gray-300/20":
          props.outlined && props.severity === "secondary" && !props.plain,
        "text-green-500 dark:text-green-400 border border-green-500 dark:border-green-400 hover:bg-green-300/20":
          props.outlined && props.severity === "success" && !props.plain,
        "text-orange-500 dark:text-orange-400 border border-orange-500 dark:border-orange-400 hover:bg-orange-300/20":
          props.outlined && props.severity === "warning" && !props.plain,
        "text-purple-500 dark:text-purple-400 border border-purple-500 dark:border-purple-400 hover:bg-purple-300/20":
          props.outlined && props.severity === "help" && !props.plain,
        "text-red-500 dark:text-red-400 border border-red-500 dark:border-red-400 hover:bg-red-300/20":
          props.outlined && props.severity === "danger" && !props.plain,
      },
      {
        "px-4 py-3 text-base": props.size === null,
        "text-xs py-2 px-3": props.size === "small",
        "text-xl py-3 px-4": props.size === "large",
        "text-base py-2 px-3": props.size === "normal",
      },
      { "flex-column": props.iconPos == "top" || props.iconPos == "bottom" },
      { "opacity-60 pointer-events-none cursor-default": context.disabled }
    ),
  }),
  label: ({ props }) => ({
    className: classNames(
      "flex-1",
      "duration-200",
      "font-bold",
      {
        "hover:underline": props.link,
      },
      { "invisible w-0": props.label == null }
    ),
  }),
  icon: ({ props }) => ({
    className: classNames("mx-0", {
      "mr-2": props.iconPos == "left" && props.label != null,
      "ml-2 order-1": props.iconPos == "right" && props.label != null,
      "mb-2": props.iconPos == "top" && props.label != null,
      "mt-2 order-2": props.iconPos == "bottom" && props.label != null,
    }),
  }),
  loadingIcon: ({ props }) => ({
    className: classNames("mx-0", {
      "mr-2": props.loading && props.iconPos == "left" && props.label != null,
      "ml-2 order-1":
        props.loading && props.iconPos == "right" && props.label != null,
      "mb-2": props.loading && props.iconPos == "top" && props.label != null,
      "mt-2 order-2":
        props.loading && props.iconPos == "bottom" && props.label != null,
    }),
  }),
  badge: ({ props }) => ({
    className: classNames({
      "ml-2 w-4 h-4 leading-none flex items-center justify-center": props.badge,
    }),
  }),
};
