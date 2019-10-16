def remote_file_exists?(path)
  test("[ -f #{path} ]")
end
