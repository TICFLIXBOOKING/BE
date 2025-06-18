import z from 'zod';

export const cinemaSchema = z.object({
    name: z
        .string({ message: 'Tên rạp không được để trống!' })
        .min(3, { message: 'Tên rạp phải có ít nhất 3 ký tự!' })
        .max(100, { message: 'Tên rạp không được vượt quá 100 ký tự!' }),
    address: z
        .string({ message: 'Địa chỉ không được để trống!' })
        .min(5, { message: 'Địa chỉ phải có ít nhất 5 ký tự!' })
        .max(200, { message: 'Địa chỉ không được vượt quá 200 ký tự!' }),
    phoneNumber: z
        .string({ message: 'Số điện thoại không được để trống!' })
        .min(6, { message: 'Số điện thoại phải có ít nhất 6 ký tự!' })
        .max(15, { message: 'Số điện thoại không được vượt quá 15 ký tự!' }),
});
