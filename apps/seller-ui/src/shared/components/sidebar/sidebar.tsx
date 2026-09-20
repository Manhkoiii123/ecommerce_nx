"use client";
import { usePathname } from "next/navigation";
import useSidebar from "../../../hooks/useSidebar";
import React, { useEffect } from "react";
import useSeller from "../../../hooks/useSeller";
import Box from "../box";
import { Sidebar } from "./sidebar.styles";
import Link from "next/link";
import Logo from "../../../assets/svgs/logo";
import SidebarItem from "./sidebar.item";
import {
  BellPlus,
  BellRing,
  CalendarPlus,
  LayoutDashboard,
  ListOrdered,
  LogOut,
  Mail,
  PackageSearch,
  Settings,
  SquarePlus,
  TicketPercent,
  Wallet,
} from "lucide-react";
import SidebarMenu from "./sidebar.menu";
const SidebarWrapper = () => {
  const { activeSidebar, setAcitveSidebar } = useSidebar();
  const pathName = usePathname();
  const { seller } = useSeller();
  useEffect(() => {
    setAcitveSidebar(pathName);
  }, [pathName, setAcitveSidebar]);

  const getIconColor = (route: string) =>
    activeSidebar === route ? "#0085ff" : "#969696";
  return (
    <Box
      css={{
        height: "100%",
        zIndex: 202,
        padding: "8px",
        overflowY: "auto",
        scrollbarWidth: "none",
      }}
      className="sidebar-wrapper"
    >
      <Sidebar.Header>
        <Box>
          <Link href={"/"} className="flex items-center justify-center gap-2">
            <Logo showText={false} />
            <Box>
              <h3 className="text-xl font-medium text-[#ecedee]">
                {seller?.shop?.name}
              </h3>
              <h5 className="font-medium pl-2 text-xs text-[#ecedeecf] whitespace-nowrap overflow-hidden text-ellipsis max-w-[170px]">
                {seller?.shop?.address}
              </h5>
            </Box>
          </Link>
        </Box>
      </Sidebar.Header>
      <div className="block my-3">
        <Sidebar.Body className="body sidebar">
          <SidebarItem
            title="Dashboard"
            icon={<LayoutDashboard fill={getIconColor("/dashboard")} />}
            isActive={activeSidebar === "/dashboard"}
            href="/dashboard"
          />
          <div className="mt-2 block">
            <SidebarMenu title="Main Menu">
              <SidebarItem
                title="Orders"
                icon={<ListOrdered fill={getIconColor("/dashboard/orders")} />}
                isActive={activeSidebar === "/dashboard/orders"}
                href="/dashboard/orders"
              />
              <SidebarItem
                title="Payments"
                icon={<Wallet fill={getIconColor("/dashboard/payments")} />}
                isActive={activeSidebar === "/dashboard/payments"}
                href="/dashboard/payments"
              />
            </SidebarMenu>
            <SidebarMenu title="Products">
              <SidebarItem
                title="Create Product"
                icon={
                  <SquarePlus
                    fill={getIconColor("/dashboard/create-product")}
                  />
                }
                isActive={activeSidebar === "/dashboard/create-product"}
                href="/dashboard/create-product"
              />
              <SidebarItem
                title="All Product"
                icon={
                  <PackageSearch
                    fill={getIconColor("/dashboard/all-product")}
                  />
                }
                isActive={activeSidebar === "/dashboard//all-product"}
                href="/dashboard//all-product"
              />
            </SidebarMenu>
            <SidebarMenu title="Events">
              <SidebarItem
                title="Create Event"
                icon={
                  <CalendarPlus
                    fill={getIconColor("/dashboard/create-event")}
                  />
                }
                isActive={activeSidebar === "/dashboard/create-event"}
                href="/dashboard/create-event"
              />
              <SidebarItem
                title="All Events"
                icon={<BellPlus fill={getIconColor("/dashboard/all-events")} />}
                isActive={activeSidebar === "/dashboard//all-events"}
                href="/dashboard//all-events"
              />
            </SidebarMenu>
            <SidebarMenu title="Controllers">
              <SidebarItem
                title="Inbox"
                icon={<Mail fill={getIconColor("/dashboard/inbox")} />}
                isActive={activeSidebar === "/dashboard/inbox"}
                href="/dashboard/inbox"
              />
              <SidebarItem
                title="Settings"
                icon={<Settings fill={getIconColor("/dashboard/settings")} />}
                isActive={activeSidebar === "/dashboard/settings"}
                href="/dashboard/settings"
              />
              <SidebarItem
                title="Notifications"
                icon={
                  <BellRing fill={getIconColor("/dashboard/notifications")} />
                }
                isActive={activeSidebar === "/dashboard/notifications"}
                href="/dashboard/notifications"
              />
            </SidebarMenu>
            <SidebarMenu title="Extras">
              <SidebarItem
                title="Discount codes"
                icon={
                  <TicketPercent
                    fill={getIconColor("/dashboard/discount-codes")}
                  />
                }
                isActive={activeSidebar === "/dashboard/discount-codes"}
                href="/dashboard/discount-codes"
              />
              <SidebarItem
                title="Logout"
                icon={<LogOut fill={getIconColor("/logout")} />}
                isActive={activeSidebar === "/logout"}
                href="/"
              />
            </SidebarMenu>
          </div>
        </Sidebar.Body>
      </div>
    </Box>
  );
};

export default SidebarWrapper;
