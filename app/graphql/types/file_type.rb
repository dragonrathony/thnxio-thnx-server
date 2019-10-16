module Types
    class FileType < BaseScalar
        graphql_name 'File'
        description 'action_dispatch_uploaded_file'

        def self.coerce_input (input_value, context)
            return nil if input_value.nil?

            ActionDispatch::Http::UploadedFile.new(
                filename: input_value.original_filename,
                type: input_value.content_type,
                head: input_value.headers,
                tempfile: input_value.tempfile
            )
        end
    end
end