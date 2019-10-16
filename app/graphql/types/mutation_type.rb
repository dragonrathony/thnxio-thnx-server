module Types
  class MutationType < Types::BaseObject
    ## User Auth 
    field :login, mutation: Mutations::Login
    field :logout, mutation: Mutations::Logout
    field :register_user, mutation: Mutations::RegisterUser
    field :update_user, mutation: Mutations::UpdateUser
    field :reset_password, mutation: Mutations::ResetPassword
    field :reset_password_request, mutation: Mutations::ResetPasswordRequest
    field :confirm_account, mutation: Mutations::ConfirmAccount

    #Organisations
    field :create_organisation, mutation: Mutations::CreateOrganisation
    field :update_organisation, mutation: Mutations::UpdateOrganisation
    field :update_address, mutation: Mutations::UpdateAddress
    field :create_account_admin, mutation: Mutations::CreateAccountAdmin
    field :create_thnx_admin, mutation: Mutations::CreateThnxAdmin
    field :remove_account_users, mutation: Mutations::RemoveAccountUsers
    field :assign_thnx_evenly, mutation: Mutations::AssignThnxBulk

    #Merchant
    field :create_merchant, mutation: Mutations::CreateMerchant
    field :update_merchant, mutation: Mutations::UpdateMerchant
    field :create_remittance_batch, mutation: Mutations::CreateRemittanceBatch
    field :update_remittance_batch, mutation: Mutations::UpdateRemittanceBatch

    field :give_thnx, mutation: Mutations::GiveThnx
    field :assign_thnx, mutation: Mutations::AssignThnx
    field :buy_thnx, mutation: Mutations::BuyThnx
    field :ms_teams_send_thnx, mutation: Mutations::MSTeamsSendThnx
    field :ms_teams_buy_thnx, mutation: Mutations::MSTeamsBuyThnx
    
  end
end