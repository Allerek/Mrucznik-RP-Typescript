LoadAllLeaders()
{
	new Cache:result = mysql_query(SQL_ID, "SELECT FracID, COUNT(*) FROM `mru_liderzy` GROUP BY FracID", true);
	if(cache_is_valid(result))
	{
		for(new i; i < cache_num_rows(); i++)
		{
			new idx;
			cache_get_value_index_int(i, 0, idx);
			cache_get_value_index_int(i, 1, LeadersValue[LEADER_FRAC][idx]);
		}
		cache_delete(result);
	}
}