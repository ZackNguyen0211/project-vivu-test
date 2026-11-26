export function buildSepayVietQrUrl(params: {
  bankName?: string;
  accountNo?: string;
  amount: number;
  bookingCode: string;
}): string {
  const bank = params.bankName || "MBBank";
  const acc = params.accountNo || "0912345678999";
  return `https://qr.sepay.vn/img?bank=${encodeURIComponent(
    bank
  )}&acc=${encodeURIComponent(acc)}&template=compact&amount=${
    params.amount
  }&des=${encodeURIComponent(params.bookingCode)}`;
}
