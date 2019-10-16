module Mutations
    class CreateRemittanceBatch < BaseMutation
        null true
        description "Create Remittance Batch"

        # input fields
        argument :remittance_payment_ids, [Integer], required: true

        # response fields
        field :remittance_batch, Types::RemittanceBatchType, null: true
        field :errors, [String], null: true
      
        def resolve(remittance_payment_ids:)
          begin
            if remittance_payment_ids.count > 0
              batch = RemittanceBatch.create(start_processing_at: Time.now.utc)
              total = 0
              remittance_payment_ids.each { |id| 
                payment = RemittancePayment.find(id)

                #check format of bsb
                bsb = false
                bsb = payment.merchant_account.bsb.to_s

                # do no add to a batch if it is processing
                if !payment.processing && bsb.present? && bsb.match(/\d{3}-?\d{3}$/).present?
                  payment.update_attributes!(remittance_batch_id: batch.id)
                  total = total + payment.total
                end
              }
              batch.update_attributes!(line_item_count: RemittancePayment.where(remittance_batch_id: batch.id).count, total: total)
              return {remittance_batch: batch}
            else
              return {errors: ["No payments selected to run batch"]}
            end
          rescue Error => e
            return {errors: ["Failed to create batch"]}
          end
        end


        def ready?(**args)
          true
        end

        def authorized?(**args)
          context[:current_user].has_role? :super_admin
        end
    end
end