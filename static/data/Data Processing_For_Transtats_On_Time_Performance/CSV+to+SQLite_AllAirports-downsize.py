
# coding: utf-8

# In[60]:


#import dependencies
import pandas as pd
import numpy as np
import sqlite3
from pandas.io import sql
import subprocess


# In[50]:


# import SQLalchemy dependencies
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
Base = declarative_base()

from sqlalchemy import Column, Integer, String, Float

import pymysql
pymysql.install_as_MySQLdb()


# In[51]:


#read csv into dataframe
df = pd.read_csv('transtats_final.csv', sep=',',  dtype='unicode')


# In[52]:


#inspect dataframe
df.head(10)


# In[53]:


# In and output file paths
in_csv = 'transtats_final.csv'
out_sqlite = 'transtats_dataset_Finalversion.sqlite'

table_name = 'my_table_finalversion' # name for the SQLite database table
chunksize = 10000000 # number of lines to process at each iteration


# In[54]:


# columns that should be read from the CSV file
columns = ['CARRIER', 'ORIGIN', 'ORIGIN_CITY_NAME', 'DEST', 'DEST_CITY_NAME', 'DEP_DELAY', 'WEATHER_DELAY', 'LATE_AIRCRAFT_DELAY'] 


# In[55]:


# Get number of lines in the CSV file
nlines = subprocess.check_output(['wc', '-l', in_csv])
nlines = int(nlines.split()[0]) 


# In[56]:


# connect to database
cnx = sqlite3.connect(out_sqlite)


# In[57]:


# Iteratively read CSV and dump lines into the SQLite table
for i in range(0, nlines, chunksize):  # change 0 -> 1 if your csv file contains a column header
    
    df = pd.read_csv(in_csv,  
            header=None,  # no header, define column header manually later
            nrows=chunksize, # number of rows to read at each iteration
            skiprows=i)   # skip rows that were already read


# In[58]:


# columns to read        
df.columns = columns

sql.to_sql(df, 
            name=table_name, 
            con=cnx, 
            index=False, # don't use CSV file index
            index_label='ORIGIN', # use a unique column from DataFrame as index
            if_exists='append') 


# In[59]:


#write dataframe to SQlite
df.to_sql(out_sqlite, cnx, schema=None, if_exists='fail', index=True, index_label=None, chunksize=None, dtype=None)

