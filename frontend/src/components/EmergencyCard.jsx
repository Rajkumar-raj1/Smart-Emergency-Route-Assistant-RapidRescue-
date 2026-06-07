const EmergencyCard = ({
  title,
  description,
  icon,
  color = "bg-red-500",
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="
        bg-white
        rounded-2xl
        shadow-md
        hover:shadow-xl
        transition
        duration-300
        cursor-pointer
        p-5
        md:p-6
        flex
        flex-col
        items-center
        text-center
        border
        border-gray-200
        hover:-translate-y-1
        active:scale-[0.98]
        w-full
      "
    >
      {/* ================= ICON ================= */}
      <div
        className={`
          ${color}
          text-white
          p-4
          md:p-5
          rounded-full
          mb-4
          text-2xl
          md:text-3xl
          flex
          items-center
          justify-center
        `}
      >
        {icon}
      </div>

      {/* ================= TITLE ================= */}
      <h2
        className="
          text-lg
          md:text-xl
          font-bold
          text-gray-800
          mb-2
        "
      >
        {title}
      </h2>

      {/* ================= DESCRIPTION ================= */}
      <p
        className="
          text-gray-500
          text-sm
          md:text-base
          leading-relaxed
        "
      >
        {description}
      </p>
    </div>
  );
};

export default EmergencyCard;