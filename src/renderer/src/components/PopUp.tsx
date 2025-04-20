const PopUp = ({
  onClose,
  message,
  header
}: {
  onClose: () => void
  message: string
  header: string
}): React.JSX.Element => {
  return (
    <div className="fixed inset-0 flex justify-center items-center z-20" onClick={onClose}>
      <div
        className="pixel-border bg-white p-6 w-80 text-center"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <h2 className="text-xl font-bold mb-4">{header}</h2>
        <p>{message}</p>
        <button
          onClick={onClose}
          className="pixel-border mt-4 px-6 py-2 border-2 border-tg-brown rounded-lg hover:scale-110"
        >
          Got It!
        </button>
      </div>
    </div>
  );
};

export default PopUp;