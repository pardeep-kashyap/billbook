"use-client";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { Button } from "./ui/button";
import { Icons } from "./icons";
import { INVOICE_TEMPLATE } from "@/template/invoice-template";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const PrintInvoice = ({
  items,
  total,
  date,
  invoiceNo,
  discountedPrice,
  totalPayableAmount,
  gstTaxAmount,
  company,
}: {
  items: any[];
  total: string;
  invoiceNo: string;
  date: string;
  discountedPrice: string;
  totalPayableAmount: String;
  gstTaxAmount: String;
  company: any;
}) => {
  const printInvoice = () => {
    pdfMake.createPdf(INVOICE_TEMPLATE).print();
  };

  return (
    <Button variant={"ghost"} onClick={printInvoice}>
      <Icons.print className="mr-2 h-4 w-4" />
    </Button>
  );
};

export default PrintInvoice;
