'use client';
import React, { ChangeEvent, useState, FormEvent } from 'react';
import { Input } from '@/components/ui/input';
import axios from 'axios';

type PageProps = {
  params: {
    username: string;
    activeCategory: string;
    activeAction: string;
  };
};

const Page: React.FC<PageProps> = ({ params }) => {
  const { username, activeCategory, activeAction } = params;
  const [data, setData] = useState({
    username,
    no: 0,
    money: 0,
    interest: 0,
    note: ''
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: name === 'money' || name === 'interest' || name === 'no' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      let url = '';
      let method = 'POST';

      if (activeAction === 'add') {
        switch (activeCategory) {
          case 'givenmoney':
            url = '/api/addvalueGM';
            break;
          case 'takenmoney':
            url = '/api/addTakenMoney';
            break;
          case 'extramoney':
            url = '/api/addExtraMoney';
            break;
          default:
            throw new Error('Invalid category');
        }
      } else if (activeAction === 'delete') {
        method = 'DELETE';
        switch (activeCategory) {
          case 'givenmoney':
            url = '/api/deleteGM';
            break;
          case 'takenmoney':
            url = '/api/deleteTakenMoney';
            break;
          case 'extramoney':
            url = '/api/deleteExtraMoney';
            break;
          default:
            throw new Error('Invalid category');
        }
      }

      const requestConfig = {
        method,
        url,
        data: JSON.stringify({ ...data, username }),
        headers: {
          'Content-Type': 'application/json'
        }
      };

      await axios(requestConfig);
      setData({
        username,
        no: 0,
        money: 0,
        interest: 0,
        note: ''
      });
    } catch (error: any) {
      setError(error.response?.data?.message || 'An error occurred');
    }
  };

  const [error, setError] = useState<string | null>(null);

  return (
    <div>
      <div>
        <h1>Username: {username}</h1>
        <h2>Active Category: {activeCategory}</h2>
        <h2>Active Action: {activeAction}</h2>
      </div>
      <div>
        <form onSubmit={handleSubmit}>
          {(activeCategory === 'givenmoney' || activeCategory === 'takenmoney') && (
            <Input
              type="number"
              placeholder="no"
              name="no"
              value={data.no}
              onChange={handleChange}
              required
            />
          )}
          {activeCategory === 'givenmoney' && activeAction === 'add' && (
            <Input
              type="number"
              placeholder="money"
              name="money"
              value={data.money}
              onChange={handleChange}
              required
            />
          )}
          {activeCategory === 'takenmoney' && activeAction === 'add' && (
            <>
              <Input
                type="number"
                placeholder="money"
                name="money"
                value={data.money}
                onChange={handleChange}
                required
              />
              <Input
                type="number"
                placeholder="interest"
                name="interest"
                value={data.interest}
                onChange={handleChange}
                required
              />
            </>
          )}
          {activeCategory === 'extramoney' && activeAction === 'add' && (
            <>
              <Input
                type="number"
                placeholder="money"
                name="money"
                value={data.money}
                onChange={handleChange}
                required
              />
              <Input
                type="text"
                placeholder="note"
                name="note"
                value={data.note}
                onChange={handleChange}
                required
              />
            </>
          )}
          {activeCategory === 'extramoney' && activeAction === 'delete' && (
            <Input
              type="text"
              placeholder="note"
              name="note"
              value={data.note}
              onChange={handleChange}
              required
            />
          )}
          <button type="submit">{activeAction}</button>
        </form>
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
};

export default Page;
