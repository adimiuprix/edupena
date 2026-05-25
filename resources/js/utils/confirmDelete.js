import Swal from 'sweetalert2';

/**
 * Modal konfirmasi hapus menggunakan SweetAlert2.
 * @returns {Promise<boolean>} true jika user menekan tombol hapus
 */
export async function confirmDelete({
    title = 'Hapus data?',
    text = 'Data yang dihapus tidak dapat dikembalikan.',
    confirmButtonText = 'Ya, Hapus',
    cancelButtonText = 'Batal',
} = {}) {
    const result = await Swal.fire({
        title,
        text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#e11d48',
        cancelButtonColor: '#64748b',
        confirmButtonText,
        cancelButtonText,
        reverseButtons: true,
        focusCancel: true,
        customClass: {
            popup: 'rounded-2xl',
            confirmButton: 'rounded-xl font-semibold',
            cancelButton: 'rounded-xl font-semibold',
        },
    });

    return result.isConfirmed;
}
