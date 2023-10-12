let ChainTypes = {};

ChainTypes.reserved_spaces = {
    relative_protocol_ids: 0,
    protocol_ids: 1,
    implementation_ids: 2
};

ChainTypes.object_type = {
    null: 0,
    base: 1,
    account: 2,
    asset: 3,
    force_settlement: 4,
    committee_member: 5,
    witness: 6,
    limit_order: 7,
    call_order: 8,
    custom: 9,
    proposal: 10,
    operation_history: 11,
    withdraw_permission: 12,
    vesting_balance: 13,
    worker: 14,
    balance: 15,
    htlc: 16,
    custom_active_authorities: 17, // TODO: not active on the main net.
    ticket: 18,
    personal_data: 19,
    content_card: 20,
    permission: 21,
    content_vote: 22,
    vote_master_summary: 23,
    commit_reveal: 24,
    commit_reveal_v2: 25,
    content_card_v2: 26,
    personal_data_v2: 27
};

ChainTypes.impl_object_type = {
    global_property: 0,
    dynamic_global_property: 1,
    index_meta: 2,
    asset_dynamic_data: 3,
    asset_bitasset_data: 4,
    account_balance: 5,
    account_statistics: 6,
    transaction: 7,
    block_summary: 8,
    account_transaction_history: 9,
    blinded_balance: 10,
    chain_property: 11,
    witness_schedule: 12,
    budget_record: 13
};

ChainTypes.vote_type = {
    committee: 0,
    witness: 1,
    worker: 2
};

ChainTypes.operations = {
    transfer: 0,
    account_create: 1,
    account_update: 2,
    account_whitelist: 3,
    account_upgrade: 4,
    account_transfer: 5,
    asset_create: 6,
    asset_update: 7,
    asset_update_bitasset: 8,
    asset_update_feed_producers: 9,
    asset_issue: 10,
    asset_reserve: 11,
    asset_fund_fee_pool: 12,
    asset_settle: 13,
    asset_global_settle: 14,
    asset_publish_feed: 15,
    witness_create: 16,
    witness_update: 17,
    proposal_create: 18,
    proposal_update: 19,
    proposal_delete: 20,
    withdraw_permission_create: 21,
    withdraw_permission_update: 22,
    withdraw_permission_claim: 23,
    withdraw_permission_delete: 24,
    committee_member_create: 25,
    committee_member_update: 26,
    committee_member_update_global_parameters: 27,
    vesting_balance_create: 28,
    vesting_balance_withdraw: 29,
    custom: 30,
    assert: 31,
    balance_claim: 32,
    override_transfer: 33,
    asset_settle_cancel: 34,
    asset_claim_fees: 35,
    fba_distribute: 36,
    asset_claim_pool: 37,
    asset_update_issuer: 38,
    personal_data_create: 39,
    personal_data_remove: 40,
    content_card_create: 41,
    content_card_update: 42,
    content_card_remove: 43,
    permission_create: 44,
    permission_remove: 45,
    commit_create: 46,
    reveal_create: 47,
    worker_create: 48,
    htlc_create: 49,
    htlc_redeem: 50,
    htlc_redeemed: 51,
    htlc_extend: 52,
    htlc_refund: 53,
    limit_order_create: 54,
    limit_order_cancel: 55,
    call_order_update: 56,
    fill_order: 57,
    custom_authority_create: 58,
    custom_authority_update: 59,
    custom_authority_delete: 60,
    ticket_create: 61,
    ticket_update: 62,
};

ChainTypes.ticket_type = {
    liquid: 0,
    lock_180_days: 1,
    lock_360_days: 2,
    lock_720_days: 3,
    lock_forever: 4
};

export default ChainTypes;
