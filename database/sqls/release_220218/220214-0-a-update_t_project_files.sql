update t_project_files
set extension = "ai"
where RIGHT(filepath,3) = ".ai"
and extension = "pdf" ;