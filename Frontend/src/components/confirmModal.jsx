import "../assets/styles/confirmModal.css"

const ConfirmModal = ({
    isOpen,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    onCancel,
    danger = false,
}) => {
    if (!isOpen) return null;

    return (
        <div className="modal-backdrop">
            <div className={`modal ${danger ? 'danger' : ''}`}>
                <h2>{title}</h2>
                <p>{message}</p>

                <div className="actions">
                    <button onClick={onCancel}>{cancelText}</button>
                    <button onClick={onConfirm}>{confirmText}</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
