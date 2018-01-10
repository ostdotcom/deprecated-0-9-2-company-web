namespace :devops do

  require 'pathname'

  # rake devops:upload_assets_to_s3 RAILS_ENV=development ST_PROFILE=stf-production
  task :upload_assets_to_s3 => :environment do

    environment = Rails.env
    asset_bucket = "wa.openst.org"
    aws_profile = ENV['ST_PROFILE']

    content_types = {
      '.gz' => 'gzip',
    }

    # auth_key_str = "--access_key=#{access_key} --secret_key=#{secrete_key}"

    permission_options = "--acl public-read --content-encoding gzip --cache-control 'public, max-age=315360000' --expires 'Thu, 25 Jun 2025 20:00:00 GMT'"

    Dir.chdir("./public#{Rails.application.config.assets.prefix}") do
      Dir['**/*.*'].each do |file|
        file_path = Pathname(file)
        # Upload compressed JS and CSS files on S3
        if content_types.key?(file_path.extname)
          upload_file_name = file_path.to_s.split(File.extname(file)).first
          upload_file_extension = upload_file_name.split(".").last.to_s
          puts file_path
          if upload_file_extension.include?("js")
            puts "aws s3 cp #{Rails.root.to_s}/public#{Rails.application.config.assets.prefix}/#{file} s3://#{asset_bucket}#{Rails.application.config.assets.prefix}/#{upload_file_name} #{permission_options} --content-type 'application/x-javascript' --profile #{aws_profile}"
            %x{aws s3 cp #{Rails.root.to_s}/public#{Rails.application.config.assets.prefix}/#{file} s3://#{asset_bucket}#{Rails.application.config.assets.prefix}/#{upload_file_name} #{permission_options} --content-type 'application/x-javascript' --profile #{aws_profile}}
          elsif upload_file_extension.include?("css")
            puts "aws s3 cp #{Rails.root.to_s}/public#{Rails.application.config.assets.prefix}/#{file} s3://#{asset_bucket}#{Rails.application.config.assets.prefix}/#{environment}/#{upload_file_name} #{permission_options} --content-type 'text/css' --profile #{aws_profile}"
            %x{aws s3 cp #{Rails.root.to_s}/public#{Rails.application.config.assets.prefix}/#{file} s3://#{asset_bucket}#{Rails.application.config.assets.prefix}/#{upload_file_name} #{permission_options} --content-type 'text/css' --profile #{aws_profile}}
          else
            puts "Can't upload #{file}"
          end
        end
      end
    end

  end

end
