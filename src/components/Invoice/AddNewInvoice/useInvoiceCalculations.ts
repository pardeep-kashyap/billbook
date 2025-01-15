import { useMemo } from 'react'
import { ItemFormFields } from '@/components/FormWithTable/AddItemForm/AddItemForm'

export const useInvoiceCalculations = (items: ItemFormFields[]) => {
  return useMemo(() => {
    const calculateTotal = (property: keyof ItemFormFields) =>
      Number(
        items
          .reduce((total, row) => {
            const value = row[property]
            return total + (typeof value === 'number' ? value : 0)
          }, 0)
          .toFixed(2)
      )
    const calculateTotalTax = () =>
      Number(
        items
          .reduce((total, row) => {
            const taxAmount = (row.rate * Number(row.quantity)) * (Number(row.tax) / 100)
            return total + taxAmount
          }, 0)
          .toFixed(2)
      )

    const totalAmount = calculateTotal('amount')
    const totalRate = calculateTotal('rate')
    const totalQuantity = calculateTotal('quantity')
    const tax = calculateTotalTax()
    const totalGrossAmt = calculateTotal('grossTotalAmount')

    const gstTaxAmount = (totalAmount * 18) / 100
    const totalPayableAmount = Number((totalAmount + gstTaxAmount).toFixed(2))

    return {
      totalAmount,
      totalRate,
      totalQuantity,
      tax,
      totalGrossAmt,
      gstTaxAmount,
      totalPayableAmount,
    }
  }, [items])
}
