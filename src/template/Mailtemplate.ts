export type Content = {
    subject: string;
    content: {
        title?: string;
        description: string;
        warning?: string;
        email: string;
        reason?: string;
        bannedAt?: Date;
    };
    voucher?: {
        name: string;
        code: string;
        discount: number;
    };
    product?: {
        items: {
            productId?: string;
            image: string;
            name: string;
            size: string;
            color: string;
            quantity: number | null;
            price: number;
        }[];
        totalPrice: number;
        shippingfee: number;
    };
    link: {
        linkName: string;
        linkHerf: string;
    };
    user?: {
        name: string;
        phone: string;
        email: string;
        address: string;
    };
};

type Template = 'Verify' | 'ResetPassword' | 'UpdateStatusOrder' | 'BanAccount' | 'UnbanAccount';

export const templateMail = (template: Template, mailContent: Content) => {
    switch (template) {
        case 'Verify':
            return `<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Kích hoạt tài khoản - TICFLIX OFFICIAL</title>
<style>
  body, html {
    margin: 0; padding: 0; 
    background-color: #141414; 
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    color: #E5E5E5;
  }
  a {
    color: #e50914; /* Netflix red */
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }

  .container {
    max-width: 600px;
    margin: 40px auto;
    background-color: #181818;
    border-radius: 8px;
    box-shadow: 0 8px 16px rgba(0,0,0,0.6);
    overflow: hidden;
  }

  .header {
    background: linear-gradient(90deg, #e50914 0%, #b31217 100%);
    padding: 25px 30px;
    text-align: center;
  }
  .header img {
    max-height: 70px;
    margin-bottom: 10px;
  }
  .header h1 {
    margin: 0;
    font-size: 28px;
    font-weight: 700;
    color: white;
    letter-spacing: 1px;
  }

  .content {
    padding: 30px 35px;
    color: #ccc;
    font-size: 16px;
    line-height: 1.5;
  }
  .content h2 {
    color: white;
    font-weight: 700;
    margin-top: 0;
  }
  .content p {
    margin-bottom: 20px;
  }

  .btn {
    display: inline-block;
    background-color: #e50914;
    color: white !important;
    font-weight: 700;
    padding: 14px 30px;
    border-radius: 5px;
    font-size: 16px;
    letter-spacing: 1px;
    transition: background-color 0.3s ease;
  }
  .btn:hover {
    background-color: #b31217;
  }

  .warning {
    background-color: #3a0000;
    border-left: 5px solid #e50914;
    padding: 15px 20px;
    margin-top: 25px;
    color: #f44336;
    font-weight: 600;
  }

  .footer {
    background-color: #222;
    text-align: center;
    padding: 20px 30px;
    font-size: 13px;
    color: #666;
  }
</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>TICFLIX</h1>
      <h1>${mailContent?.content?.title}</h1>
    </div>
    <div class="content">
      <h2>Xin chào, ${mailContent?.content?.email}!</h2>
      <p>${mailContent.content.description}</p>

      <a href="${mailContent?.link?.linkHerf}" class="btn" target="_blank" rel="noopener noreferrer">
        ${mailContent?.link?.linkName}
      </a>

      ${mailContent.content.warning ? `<div class="warning">${mailContent.content.warning}</div>` : ''}
    </div>
    <div class="footer">
      <p>© 2025 TICFLIX OFFICIAL. Đã đăng ký bản quyền</p>
      <p>Nơi hòa quyện cảm xúc giữa chốn đông người</p>
    </div>
  </div>
</body>
</html>
`;

        case 'UpdateStatusOrder':
            return `
      <!DOCTYPE html>
      <html lang="vi">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Xác Nhận Đơn Hàng - AdStore</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #f4f4f4;">
          <div style="max-width: 700px; margin: 20px auto; background-color: white; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
              <div style="background: linear-gradient(135deg, #2c3e50, #3498db); color: white; padding: 30px; text-align: center; border-top-left-radius: 10px; border-top-right-radius: 10px;">
                  <img src="https://res.cloudinary.com/dpplfiyki/image/upload/v1739560660/0d52d8d6-9047-4c47-aa3f-75b82772b30f-removebg-preview_1_r1ghvy.png" alt="VERTA SPORT" style="max-height: 80px; margin-bottom: 15px;">
                  <h1 style="margin: 0; font-size: 24px;">${mailContent?.content?.title || 'Xác Nhận Đơn Hàng'}</h1>
              </div>

              <div style="padding: 30px;">
                  <h2 style="color: #2c3e50;">Xin chào, ${mailContent?.user?.name}!</h2>

                  <p style="color: #333;">${mailContent.content.description}</p>

                  <div style="background-color: #f9f9f9; border-left: 4px solid #3498db; padding: 15px; margin: 20px 0;">
                      <h3 style="margin-top: 0; color: #2c3e50;">Thông Tin Giao Hàng</h3>
                      <p><strong>Tên người nhận:</strong> ${mailContent?.user?.name}</p>
                      <p><strong>Số điện thoại:</strong> ${mailContent?.user?.phone}</p>
                      <p><strong>Email:</strong> ${mailContent?.user?.email}</p>
                      <p><strong>Địa chỉ giao hàng:</strong> ${mailContent?.user?.address}</p>
                  </div>

                  <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                      <thead>
                          <tr style="background-color: #3498db; color: white;">
                              <th style="padding: 10px; text-align: left;">Sản Phẩm</th>
                              <th style="padding: 10px; text-align: left;">Tên</th>
                              <th style="padding: 10px; text-align: left;">SL</th>
                              <th style="padding: 10px; text-align: left;">Size</th>
                              <th style="padding: 10px; text-align: left;">Màu</th>
                              <th style="padding: 10px; text-align: left;">Giá</th>
                          </tr>
                      </thead>
                      <tbody>
                          ${mailContent.product?.items
                              .map(
                                  (product) => `
                              <tr style="border-bottom: 1px solid #ecf0f1;">
                                  <td style="padding: 10px;"><img src="${product.image}" alt="${product.name}" style="max-width: 70px; border-radius: 5px;"></td>
                                  <td style="padding: 10px;">${product.name}</td>
                                  <td style="padding: 10px;">${product.quantity}</td>
                                  <td style="padding: 10px;">${product.size}</td>
                                  <td style="padding: 10px;">${product.color}</td>
                                  <td style="padding: 10px;">${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}</td>
                              </tr>
                          `,
                              )
                              .join('')}
                      </tbody>
                  </table>
         <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; border: 1px solid #e0e0e0; display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; align-items: center;">
              <div style="background-color: #3498db; color: white; width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; overflow: hidden;">
                  <img src="https://img.icons8.com/clouds/100/like--v1.png" alt="like--v1" style="width: 50px; height: 50px; object-fit: cover;"/>
              </div>
              <div>
                  <strong style="color: #2c3e50; font-size: 16px;">Cảm ơn bạn đã tin tưởng!</strong>
                  <p style="color: #7f8c8d; margin: 5px 0 0; font-size: 14px;">Chúng tôi luôn nỗ lực mang đến trải nghiệm tốt nhất</p>
              </div>
          </div>
          <div style="text-align: right;">
              <p style="margin: 0; color: #34495e; font-size: 14px;">
                  <strong>Phí Giao Hàng:</strong>
                  <span style="color: #2980b9; font-weight: bold;">
                      ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(mailContent.product?.shippingfee || 0)}
                  </span>
              </p>
              ${
                  mailContent.voucher &&
                  `<p style="margin: 0; color: #34495e; font-size: 14px;">
                  <strong>Mã giảm giá ${mailContent.voucher?.code ? mailContent.voucher?.code : ''}:</strong>
                  <span style="color: #2980b9; font-weight: bold;">
                      ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(mailContent.voucher?.discount || 0)}
                  </span>
              </p>`
              }
              <p style="margin: 5px 0 0; color: #34495e; font-size: 16px;">
                  <strong>Tổng Tiền:</strong>
                  <span style="color: #e74c3c; font-weight: bold; font-size: 18px;">
                      ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(mailContent.product?.totalPrice || 0)}
                  </span>
              </p>
          </div>
      </div>
                  <a href="${mailContent?.link?.linkHerf}" style="display: inline-block; background-color: #3498db; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; margin-top: 15px; text-align: center;">Xem Chi Tiết Đơn Hàng</a>

                  ${
                      mailContent.content.warning
                          ? `
                      <div style="background-color: #ffdddd; border-left: 4px solid #f44336; color: #d32f2f; padding: 15px; margin-top: 20px;">
                          <p>${mailContent.content.warning}</p>
                      </div>
                  `
                          : ''
                  }
              </div>

              <div style="background-color: #2c3e50; color: white; padding: 20px; text-align: center;">
                  <p>© 2024 Verta-Store. Đã đăng ký bản quyền</p>
                  <p>Trải nghiệm mua sắm hoàn hảo</p>
              </div>
          </div>
      </body>
      </html>
      `;

        case 'BanAccount':
            return `
      <!DOCTYPE html>
      <html lang="vi">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Tài Khoản Bị Khóa - VERTA SPORT</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #f4f4f4;">
          <div style="max-width: 700px; margin: 20px auto; background-color: white; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
              <div style="background: linear-gradient(135deg, #2c3e50, #e74c3c); color: white; padding: 30px; text-align: center; border-top-left-radius: 10px; border-top-right-radius: 10px;">
                  <img src="https://res.cloudinary.com/dpplfiyki/image/upload/v1739560660/0d52d8d6-9047-4c47-aa3f-75b82772b30f-removebg-preview_1_r1ghvy.png" alt="VERTA SPORT LOGO" style="max-height: 80px; margin-bottom: 15px;">
                  <h1 style="margin: 0; font-size: 24px;">${mailContent?.content?.title || 'Tài Khoản Của Bạn Đã Bị Khóa'}</h1>
              </div>

              <div style="padding: 30px;">
                  <h2 style="color: #2c3e50;">Xin chào, ${mailContent?.content?.email}!</h2>

                  <p style="color: #333;">${mailContent.content.description}</p>

                  <div style="background-color: #ffdddd; border-left: 4px solid #e74c3c; padding: 15px; margin: 20px 0;">
                      <h3 style="margin-top: 0; color: #e74c3c;">Thông Tin Khóa Tài Khoản</h3>
                      <p><strong>Lý do:</strong> ${mailContent?.content?.reason || 'Không xác định'}</p>
                      <p><strong>Thời gian khóa:</strong> ${
                          mailContent?.content?.bannedAt
                              ? new Date(mailContent.content.bannedAt).toLocaleString('vi-VN')
                              : 'Không xác định'
                      }</p>
                  </div>

                  <p style="color: #333;">Nếu bạn có thắc mắc hoặc cần hỗ trợ, vui lòng liên hệ với chúng tôi qua email: <a href="mailto:support@vertasport.com" style="color: #3498db;">support@vertasport.com</a>.</p>

                  <a href="${mailContent?.link?.linkHerf}" style="display: inline-block; background-color: #e74c3c; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; margin-top: 15px; text-align: center;">${mailContent?.link?.linkName || 'Liên Hệ Hỗ Trợ'}</a>
              </div>

              <div style="background-color: #2c3e50; color: white; padding: 20px; text-align: center;">
                  <p>© 2025 Verta Sport. Đã đăng ký bản quyền</p>
                  <p>Trải nghiệm mua sắm hoàn hảo</p>
              </div>
          </div>
      </body>
      </html>
      `;

        case 'UnbanAccount':
            return `
      <!DOCTYPE html>
      <html lang="vi">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Tài Khoản Được Mở Khóa - VERTA SPORT</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #f4f4f4;">
          <div style="max-width: 700px; margin: 20px auto; background-color: white; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
              <div style="background: linear-gradient(135deg, #2c3e50, #2ecc71); color: white; padding: 30px; text-align: center; border-top-left-radius: 10px; border-top-right-radius: 10px;">
                  <img src="https://res.cloudinary.com/dpplfiyki/image/upload/v1739560660/0d52d8d6-9047-4c47-aa3f-75b82772b30f-removebg-preview_1_r1ghvy.png" alt="VERTA SPORT LOGO" style="max-height: 80px; margin-bottom: 15px;">
                  <h1 style="margin: 0; font-size: 24px;">${mailContent?.content?.title || 'Tài Khoản Của Bạn Đã Được Mở Khóa'}</h1>
              </div>

              <div style="padding: 30px;">
                  <h2 style="color: #2c3e50;">Xin chào, ${mailContent?.content?.email}!</h2>

                  <p style="color: #333;">${mailContent.content.description}</p>

                  <div style="background-color: #e6ffed; border-left: 4px solid #2ecc71; padding: 15px; margin: 20px 0;">
                      <h3 style="margin-top: 0; color: #2ecc71;">Thông Tin Mở Khóa</h3>
                      <p><strong>Thời gian mở khóa:</strong> ${new Date().toLocaleString('vi-VN')}</p>
                  </div>

                  <p style="color: #333;">Bạn có thể tiếp tục sử dụng tài khoản của mình. Nếu có thắc mắc, vui lòng liên hệ với chúng tôi qua email: <a href="mailto:support@vertasport.com" style="color: #3498db;">support@vertasport.com</a>.</p>

                  <a href="${mailContent?.link?.linkHerf}" style="display: inline-block; background-color: #2ecc71; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; margin-top: 15px; text-align: center;">${mailContent?.link?.linkName || 'Đăng Nhập Ngay'}</a>
              </div>

              <div style="background-color: #2c3e50; color: white; padding: 20px; text-align: center;">
                  <p>© 2025 Verta Sport. Đã đăng ký bản quyền</p>
                  <p>Trải nghiệm mua sắm hoàn hảo</p>
              </div>
          </div>
      </body>
      </html>
      `;

        default:
            return 'none';
    }
};
