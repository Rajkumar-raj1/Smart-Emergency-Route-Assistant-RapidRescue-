import { FaBell } from "react-icons/fa";

const SOSButton = ({
  onClick,
  loading = false,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="
        fixed 
        bottom-5 
        right-5 
        md:bottom-6 
        md:right-6
        bg-red-600 
        hover:bg-red-700
        active:scale-95
        text-white 
        w-16 
        h-16 
        md:w-20 
        md:h-20
        rounded-full 
        shadow-2xl 
        flex 
        flex-col 
        items-center 
        justify-center 
        transition 
        duration-300 
        hover:scale-105 
        z-[1000]
      "
    >
      <FaBell
        size={24}
        className="md:text-[28px]"
      />

      <span className="text-xs md:text-sm font-bold mt-1">
        {loading ? "..." : "SOS"}
      </span>
    </button>
  );
};

export default SOSButton;