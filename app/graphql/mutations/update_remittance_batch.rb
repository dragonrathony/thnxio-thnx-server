module Mutations
    class UpdateRemittanceBatch < BaseMutation
        null true
        description "Update Remittance Batch"

        # input fields
        argument :id, Integer, required: true

        # response fields
        field :remittance_batch, Types::RemittanceBatchType, null: true
        field :errors, [String], null: true
      
        def resolve(id:)
          begin
            paid_date = Time.now.utc
              batch = RemittanceBatch.find(id)
              batch.update_attributes!(paid_at: paid_date)
              batch.remittance_payments.each { |payment| 
                payment.update_attributes!(paid_at: paid_date)
                #send email with payment details
                RemittanceSendJob.perform_later(payment.id)
              }
              return {remittance_batch: batch}
          rescue Error => e
            return {errors: ["Failed to update batch"]}
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