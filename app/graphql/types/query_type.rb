module Types
  class QueryType < Types::BaseObject
    # Add root-level fields here.
    # They will be entry points for queries on your schema.

    field :unassigned_thnx, [Types::ThnxType], null: false,
      description: "Return all unassigned thnx"
    def unassigned_thnx
      context[:pundit].policy_scope(OrganisationThnx).where(owner_user_id: nil, status: "UNASSIGNED")
    end


    field :account_users, [Types::UserType], null: false,
      description: "Return all users for an account"
    def account_users
      context[:pundit].policy_scope(User).joins(:account_user).all
    end

    field :payments, [Types::PaymentType], null: false,
      description: "Return all payments for an account"
    def payments
      context[:pundit].policy_scope(OrganisationPayment).all
    end

    field :merchants, [Types::AccountType], null: false,
       description: "Return all merchants"
    def merchants
      Merchant.all if context[:current_user].has_role? :super_admin
    end
    
    field :merchant, Types::AccountType, null: true do
      description "Find a account by ID"
      argument :id, ID, required: true
    end
    def merchant (id:)
      Merchant.find(id) if context[:current_user].has_role? :super_admin
    end

    field :merchant_lookup, Types::AccountType, null: true do
      description "Find a account by Code"
      argument :code, String, required: true
    end
    def merchant_lookup (code:)
      Merchant.where("code ilike ?", "%#{code}").first
    end

    field :current_user, Types::UserType, null: true,
      description: "Return current user" 
    def current_user
      context[:current_user]
    end

    field :account, Types::AccountType, null: true,
    description: "Return current account"
    def account
        context[:current_account]
    end

    field :redeemed_gifts, [Types::MerchantGiftType], null: false do
      description "Return current account redeemed gifts"
      argument :id, ID, required: false
    end

    def redeemed_gifts (id: nil)
      account = Merchant.find(id) if id.present?
      account = Merchant.find(context[:current_account].id) unless account.present?
      account&.redeemed_gifts
    end
    field :remittance_batches, [Types::RemittanceBatchType], null: true do
      description "Return current account batches"
    end

    def remittance_batches ()
      user = context[:current_user]
      if user.has_role? :super_admin
        RemittanceBatch.all
      end
    end
    field :remittance_payments, [Types::RemittancePaymentType], null: true do
      description "Return current account payments"
      argument :id, ID, required: false
    end

    def remittance_payments (id: nil)
      user = context[:current_user]
      if user.has_role? :super_admin
        RemittancePayment.all
      else
        account = Merchant.find(id) if id.present? 
        account = Merchant.find(context[:current_account].id) unless account.present?
        RemittancePayment.where(merchant_account_id: account.id) #if user.has_role? :merchant_admin
      end
    end


    field :unpaid_remittance_payments, [Types::RemittancePaymentType], null: true do
      description "Return current account payments"
      argument :id, ID, required: false
    end

    def unpaid_remittance_payments (id: nil)
      user = context[:current_user]
      if user.has_role? :super_admin
        RemittancePayment.all.where(remittance_batch_id: nil)
      end
    end


    field :remittance_payment_items, [Types::RemittancePaymentItemType], null: true do
      description "Return current payment items"
      argument :id, ID, required: true
    end

    def remittance_payment_items (id: nil)
      user = context[:current_user]
      payment = RemittancePayment.find(id) if id.present? 
      RemittancePaymentItem.where(remittance_payment_id: payment.id) #if user.has_role? :merchant_admin
    end
  end
end
