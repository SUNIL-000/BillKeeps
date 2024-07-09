// export const newInvoice = async (req, res) => {
//     const { merchantId, consumerId, items, returnValidity,
//       exchangeValidity } = req.body;
    
  
//     const merchantId = req.id;
//     console.log(merchantId)
  
//     try {
//       let totalAmount = 0;
//       const invoiceId = generateID("I");
//       const newInvoices = await Invoice.create({
  
//       const isConsumer = await Consumer.findByPk(consumerId)
//       if (!isConsumer) {
//         return res.status(404).json({
//           message: `No consumer found with consumerId ${consumerId}`,
//           success: false,
//         });
//       }
  
//       //creating new Invoices
//       const newInvoice = await Invoice.create({
//         invoiceId,
//         merchantId,
//         consumerId,
//   
//       for (const data of items) {
//         console.log(data);
//         const pdata = await Product.findByPk(data?.productId);
  
//         if (!pdata) {
//           return res
//             .status(404)
//             .json({ message: "Product not found..", success: false });
//         }
  
//         let beforeDiscount = pdata?.mrp * data?.quantity;
//         console.log("before discount", beforeDiscount);
  
//         let finalDiscountPrice = beforeDiscount;
  
//         if (data?.discountAmount) {
//           finalDiscountPrice = beforeDiscount - data?.discountAmount;
//         }
  
//         if (data?.discountPercent) {
//           const discount = beforeDiscount * (data?.discountPercent / 100);
//           finalDiscountPrice = beforeDiscount - discount;
//         }
  
//         console.log("final price", finalDiscountPrice);
  
//         totalAmount += finalDiscountPrice;
  
//         const newInvoiceItem = await InvoiceItem.create({
//       //mapping the array so that invoiceItemId and invioiceId will also include
//       const finalItems = items.map((item) => {
//         return {
//           invoiceItemId: generateID("IT"),
//           invoiceId,
//           productId: pdata?.productId,
//           quantity: data?.quantity,
//           discountAmount: data?.discountAmount,
//           discountPercent: data?.discountPercent,
//           salePrice: finalDiscountPrice,
//           invoiceId: invoiceId,
//           productId: item.productId,
//           quantity: item.quantity,
//           discountAmount: item.discountAmount,
//           discountPercent: item.discountPercent,
//           salePrice: item.salePrice,
//         };
//       });
//       //passing the whole items array
//       const newInvoiceItem = await InvoiceItem.bulkCreate(finalItems);
  
//       if (!newInvoiceItem) {
//         return res.status(400).json({
//           message: "Failed to create invoice items..",
//           success: false,
//         });
//         console.log(newInvoiceItem);
//         if (!newInvoiceItem) {
//           return res.status(400).json({
//             message: "Failed to create Invoice and invoice item..",
//             success: false,
//           });
//         }
//       }
//       console.log("total_amount", totalAmount);
//       newInvoices.totalAmount = totalAmount;
//       await newInvoices.save();
  
//       if (!newInvoices) {
//       if (!newInvoice) {
//         return res.status(400).json({
//           message: "Failed to create Invoice and invoice item..",
//           message: "Failed to create invoice .",
//           success: false,
//         });
//       }
  
  
//       return res.status(201).json({
//         message: "New Invoice and Invoice items are created successfully..",
//         message: "New Invoice created successfully..",
//         success: true,
//         newInvoice,
//       });
//     } catch (error) {
//     }
//     catch (error) {
//       console.log(error);
//       return res.status(500).json({
//         message: "Error while creating new Invoice and InvoiceIems",
//         message: "Error while creating new Invoice .",
//         success: false,
//       });
//     }