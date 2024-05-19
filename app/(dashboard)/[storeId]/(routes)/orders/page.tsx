import prismadb from "@/lib/prismadb";
import { formatPrice } from "@/lib/utils";
import { format } from "date-fns";
import OrderClient from "./components/Client";
import { OrderColumns } from "./components/columns";

const ordersPage = async ({ params }: { params: { storeId: string } }) => {
  const data = await prismadb.order.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      orderItem: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const formatedData: OrderColumns[] = data.map((order) => {
    return {
      id: order.id,
      phone: order.phone,
      address: order.address,
      isPaid: order.isPaid,
      totalPrice: formatPrice(
        order.orderItem.reduce((acc, item) => acc + +item.product.price, 0)
      ),
      products: order.orderItem.map((item) => item.product.name).join(", "),
      createdAt: format(order.createdAt, "MMMM do, yyyy"),
    };
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderClient data={formatedData} />
      </div>
    </div>
  );
};

export default ordersPage;
