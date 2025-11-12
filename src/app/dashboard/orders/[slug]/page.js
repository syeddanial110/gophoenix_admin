"use client";
import React, { useEffect, useState } from "react";
import UITypography from "@/components/UITypography/UITypography";
import UIButton from "@/components/UIButton/UIButton";
import UIInputField from "@/components/InputFields/UIInputField";
import UserPasswordChange from "@/containers/Users/UserPasswordChange";
import { useParams, useRouter } from "next/navigation";
import { apiGet, apiPost } from "@/apis/ApiRequest";
import { ApiEndpoints } from "@/utils/ApiEndpoints";
import { toast } from "sonner";
import { pathLocations } from "@/utils/navigation";
import { CornerDownRight } from "lucide-react";
import { formatDate } from "@/lib/utils";
import UIModal from "@/components/UIModal/UIModal";

const OrderById = () => {
  const { slug } = useParams();
  const router = useRouter();
  // Dummy order history data
  const orders = [
    { product: "Product A", date: "07-10-2025", price: "$50" },
    { product: "Product B", date: "07-11-2025", price: "$30" },
  ];
  const [orderDetail, setOrderDetail] = useState({});
  const [modalOpen, setModalOpen] = useState(false);

  const onChangeModal = () => {
    setModalOpen(!modalOpen);
  };



  useEffect(() => {
    apiGet(
      `${ApiEndpoints.orders.base}${ApiEndpoints.orders.getById}/${slug}`,
      (res) => {
        console.log("res order by id", res);
        setOrderDetail(res?.data);
      },
      (err) => {
        console.log("err", err);
      }
    );
  }, []);

  console.log("orderDetail", orderDetail);

  return (
    <div className="mb-40">
      <div className="flex justify-between mb-4">
        <UITypography variant="h2" text="User Details" />
       
      </div>
      <hr />
      <div className="flex mt-9">
        <div className="flex-1 border-r-4 border-#828282-50 pr-5">
          <UITypography variant="h6" text="Order History" />

          <div className="border-1 border-gray-200 mt-4 p-4 rounded-2xl bg-gray-50">
            <div className="flex justify-between">
              <div>
                <UITypography variant="h6" text="Class Name" />
                <div
                  className="mt-6 prose max-w-none [&>h1]:text-[46px] [&>h1]:font-bold [&>h2]:text-[38px] [&>h2]:font-semibold [&>h3]:text-[32px] [&>h3]:font-semibold [&>h4]:text-[28px] [&>h4]:font-semibold [&>h5]:text-[24px] [&>h5]:font-semibold [&>h6]:text-[22px] [&>h6]:font-semibold [&>p]:text-base"
                  dangerouslySetInnerHTML={{
                    __html:
                      orderDetail?.items?.length > 0 &&
                      orderDetail?.items[0]?.productName,
                  }}
                />
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex gap-1">
                  <UITypography variant="p" text="Total Amount:" />
                  <UITypography
                    variant="p"
                    text={` $${orderDetail?.totalAmount}`}
                  />
                </div>
                {orderDetail?.items?.length > 0 &&
                  orderDetail?.items[0]?.payment != null &&
                  typeof orderDetail?.items[0]?.payment == "object" && (
                    <div className="flex justify-center items-center px-3 py-2 rounded-3xl bg-[#2ccc2c2f]">
                      <UITypography
                        variant="p"
                        text={`${
                          orderDetail?.items?.length > 0 &&
                          orderDetail?.items[0]?.payment?.status
                        }`}
                        className="!text-[18px]"
                      />
                    </div>
                  )}
              </div>
            </div>
          </div>
          {/* Selected Option */}
          <div className="border-1 border-gray-200 mt-4 p-4 rounded-2xl bg-gray-50">
            <div className="flex flex-col gap-2">
              {orderDetail?.items?.length > 0 &&
                orderDetail?.items[0]?.children?.map((item) => {
                  return (
                    <>
                      <UITypography variant="h6" text="Children" />
                      <UITypography variant="p" text={`${item?.childName}`} />
                      {item?.options?.length > 0 &&
                        item?.options?.map((elm) => {
                          return (
                            <div className="flex">
                              <div>
                                <CornerDownRight />
                              </div>
                              <div>
                                <UITypography variant="h6" text="Options" />
                                <UITypography
                                  variant="p"
                                  text={elm?.optionTitle}
                                  className="!text-[18px]"
                                />
                                <UITypography
                                  variant="p"
                                  text={`Item Price: $${elm?.price}`}
                                />
                              </div>
                              {elm?.jerseyName != null && (
                                <div>
                                  <UITypography
                                    variant="h6"
                                    text="Jersey Details"
                                  />
                                  <UITypography
                                    variant="p"
                                    text={elm?.jerseyName}
                                    className="!text-[18px]"
                                  />
                                  <UITypography
                                    variant="p"
                                    text={`Jersey Size: $${elm?.jerseySize}`}
                                  />
                                </div>
                              )}
                            </div>
                          );
                        })}
                    </>
                  );
                })}
            </div>
          </div>
          {/* Payment Details */}
          {orderDetail?.items?.length > 0 &&
            orderDetail?.items[0]?.payment != null &&
            typeof orderDetail?.items[0]?.payment == "object" && (
              <div className="border-1 border-gray-200 mt-4 p-4 rounded-2xl bg-gray-50">
                <div className="flex justify-between">
                  <div>
                    <UITypography variant="h6" text="Payment Details" />
                    <UITypography
                      variant="p"
                      text={`The Payment will be charged every ${
                        orderDetail?.items?.length > 0 &&
                        orderDetail?.items[0]?.payment?.intervalGap
                      }`}
                      className="!text-[18px]"
                    />
                    <UITypography
                      variant="p"
                      text={`The Payment will be charged ${
                        orderDetail?.items?.length > 0 &&
                        orderDetail?.items[0]?.payment?.intervalCount
                      } times`}
                      className="!text-[18px]"
                    />
                    <UITypography
                      variant="p"
                      text={`Last Payment Charged ${
                        orderDetail?.items?.length > 0 &&
                        formatDate(
                          orderDetail?.items[0]?.payment?.lastPaymentDate
                        )
                      }`}
                      className="!text-[18px]"
                    />
                    <UITypography
                      variant="p"
                      text={`Next Payment will be Charged ${
                        orderDetail?.items?.length > 0 &&
                        formatDate(
                          orderDetail?.items[0]?.payment?.nextPaymentDate
                        )
                      }`}
                      className="!text-[18px]"
                    />
                    <UITypography
                      variant="p"
                      text={`Amount $${
                        orderDetail?.items?.length > 0 &&
                        orderDetail?.items[0]?.payment?.amount
                      }`}
                      className="!text-[18px]"
                    />
                  </div>
                  {/* <div className="flex gap-1">
                    <UITypography variant="p" text="Total Amount:" />
                    <UITypography
                      variant="p"
                      text={` $${orderDetail?.totalAmount}`}
                    />
                  </div> */}
                </div>
              </div>
            )}
        </div>
        <div className="flex-1 pl-8">
          {/* <UITypography variant="h6" text="Change Password" />
          <UserPasswordChange slug={slug} /> */}
        </div>
      </div>
    </div>
  );
};

export default OrderById;
