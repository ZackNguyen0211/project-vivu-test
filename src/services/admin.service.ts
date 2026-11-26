// src/services/admin.service.ts
/* eslint-disable @typescript-eslint/no-explicit-any */

import { AdminOperatorRow, AdminPayoutRow } from "@/types/portal";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function getAdminPlatformOperators(): Promise<AdminOperatorRow[]> {
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("operators")
      .select("id, code, name, hotline, status");
    if (error) console.error("Supabase platform operators unavailable:", error.message);
    if (data) {
      return data.map((operator) => ({
        id: operator.id,
        code: operator.code || "",
        name: operator.name,
        hotline: operator.hotline || "",
        active_routes_count: 0,
        total_coaches: 0,
        monthly_tickets: 0,
        gmv_vnd: 0,
        commission_rate: 5,
        on_time_rate: 98,
        status: operator.status as AdminOperatorRow["status"],
      }));
    }
  }

  return [
    {
      id: "op-1",
      code: "OP-FUTA",
      name: "Phương Trang (FUTA Bus Lines)",
      hotline: "1900 6067",
      active_routes_count: 68,
      total_coaches: 420,
      monthly_tickets: 48200,
      gmv_vnd: 14850000000,
      commission_rate: 5.0,
      on_time_rate: 98.6,
      status: "ACTIVE",
    },
    {
      id: "op-2",
      code: "OP-TBUOI",
      name: "Thành Bưởi Limousine",
      hotline: "1900 6079",
      active_routes_count: 14,
      total_coaches: 115,
      monthly_tickets: 19400,
      gmv_vnd: 6820000000,
      commission_rate: 5.5,
      on_time_rate: 97.4,
      status: "ACTIVE",
    },
    {
      id: "op-3",
      code: "OP-SAOVIET",
      name: "Sao Việt Express",
      hotline: "1900 6746",
      active_routes_count: 12,
      total_coaches: 84,
      monthly_tickets: 14100,
      gmv_vnd: 4935000000,
      commission_rate: 5.0,
      on_time_rate: 96.8,
      status: "ACTIVE",
    },
    {
      id: "op-4",
      code: "OP-HAIVAN",
      name: "Hải Vân Royal Limousine",
      hotline: "1900 6763",
      active_routes_count: 9,
      total_coaches: 45,
      monthly_tickets: 0,
      gmv_vnd: 0,
      commission_rate: 5.0,
      on_time_rate: 100,
      status: "PENDING_APPROVAL",
    },
  ];
}

export async function getAdminReconciliationPayouts(): Promise<AdminPayoutRow[]> {
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("admin_payouts")
      .select("id, settlement_code, operator_id, bank_info, cycle_label, total_bookings, gross_amount, platform_fee, refund_deduction, net_payout, payment_gateway_match, status, operators(name)");
    if (error) console.error("Supabase payouts unavailable:", error.message);
    if (data) {
      return data.map((payout: any) => ({
        id: payout.id,
        settlement_code: payout.settlement_code,
        operator_name: payout.operators?.name || "Nhà xe",
        bank_info: payout.bank_info,
        cycle_label: payout.cycle_label,
        total_bookings: payout.total_bookings,
        gross_amount: Number(payout.gross_amount),
        platform_fee: Number(payout.platform_fee),
        refund_deduction: Number(payout.refund_deduction),
        net_payout: Number(payout.net_payout),
        payment_gateway_match: payout.payment_gateway_match,
        status: payout.status,
      }));
    }
  }

  return [
    {
      id: "pay-1",
      settlement_code: "STL-202611-W3-FUTA",
      operator_name: "Phương Trang (FUTA Bus Lines)",
      bank_info: "Vietcombank • 0071000889999",
      cycle_label: "11/11/2026 - 17/11/2026",
      total_bookings: 3420,
      gross_amount: 1240000000,
      platform_fee: 62000000,
      refund_deduction: 18500000,
      net_payout: 1159500000,
      payment_gateway_match: "MATCHED_100",
      status: "READY_TO_PAY",
    },
    {
      id: "pay-2",
      settlement_code: "STL-202611-W3-TBUOI",
      operator_name: "Thành Bưởi Limousine",
      bank_info: "ACB • 190888999",
      cycle_label: "11/11/2026 - 17/11/2026",
      total_bookings: 1890,
      gross_amount: 685000000,
      platform_fee: 37675000,
      refund_deduction: 9200000,
      net_payout: 638125000,
      payment_gateway_match: "MATCHED_100",
      status: "READY_TO_PAY",
    },
    {
      id: "pay-3",
      settlement_code: "STL-202611-W3-SAOVIET",
      operator_name: "Sao Việt Express",
      bank_info: "BIDV • 3141000667788",
      cycle_label: "11/11/2026 - 17/11/2026",
      total_bookings: 1120,
      gross_amount: 412000000,
      platform_fee: 20600000,
      refund_deduction: 4500000,
      net_payout: 386900000,
      payment_gateway_match: "DISCREPANCY",
      status: "HOLD",
    },
  ];
}